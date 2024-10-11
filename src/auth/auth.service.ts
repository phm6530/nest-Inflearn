import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/auth/dto/auth-register.dto';
import { ConfigService } from '@nestjs/config';
import { ENV_JWT_SELECT, ENV_HASH_ROUND } from 'src/env-keys.const';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService, //env
    ) {}

    /**
     *
     * 1) registerWithEmail * 이메일 회원가입
     *      - email ,nickname, password를 입력받고 사용자를 생성한다.
     *      - 생성이 완료되면 바로 accessToken과 refreshToken을 반환 한다. <바로 로그인>
     *
     * 2) loginWithEmail *로그인
     *      - email, password를 입력하면 사용자 검증
     *      - 검증이 완료되면 accessToken과 refreshToken 반환
     *
     * 3) LoginUser
     *      - 1,2에서 필요한 accessToken ,refreshToken 반환하는 로직
     *
     * 4) signToken
     *      - 3에서 필요한 accessToken과 refreshToken을 sign하는 로직
     *
     * 5) authenticateWithEmailAndPassword
     *      - 2에서의 로그인을 진행할때 필요한 기본 검증로직
     */

    /**email, sub(id) , type ("access | refresh ")
     * 리프래시나 엑세스나 user, id 받는건 똑같음
     */
    signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefreshToken ? 'refresh' : 'access',
        };

        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>(ENV_JWT_SELECT),
            expiresIn: isRefreshToken ? 3600 : 300,
        });
    }

    loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true),
        };
    }

    //검증
    async authenticateWithEmailAndPassword(
        user: Pick<UsersModel, 'email' | 'password'>,
    ) {
        const { email, password } = user;
        const existingUser = await this.userService.getUserByEmail(email);

        if (!existingUser)
            throw new UnauthorizedException('존재하지 않는 사용자');

        const matchPassword = await bcrypt.compare(
            password,
            existingUser.password,
        );

        if (!matchPassword)
            throw new UnauthorizedException('비밀번호가 일치 하지 않습니다.');

        return existingUser;
    }

    async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
        const existingUser = await this.authenticateWithEmailAndPassword(user);
        return this.loginUser(existingUser);
    }

    //회원가입
    async registerWithEmail(user: RegisterUserDto) {
        const { password } = user;
        const hashPassword = await bcrypt.hash(
            password,
            this.configService.get<string>(ENV_HASH_ROUND),
        );

        const newUser = await this.userService.createUser({
            ...user,
            password: hashPassword,
        });

        return this.loginUser(newUser);
    }

    //token extract
    extractTokenFromHeader(header: string, isBearer: Boolean) {
        const splitToken = header.split(' ');
        const prefix = isBearer ? 'Bearer' : 'Basic';

        if (splitToken[0] !== prefix && splitToken.length !== 2) {
            throw new UnauthorizedException('token error');
        }
        return splitToken[1];
    }

    decodeBasicToken(basicToken: string) {
        const decode = Buffer.from(basicToken, 'base64').toString('utf-8');
        const splitString = decode.split(':');

        if (splitString.length !== 2)
            throw new UnauthorizedException('잘못된 토큰 유형입니다');

        const [email, password] = splitString;
        return {
            email,
            password,
        };
    }

    //검증
    verifyToken(token: string) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get<string>(ENV_JWT_SELECT),
            });
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('토큰이 만료되었습니다.');
            } else if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException('비정상적인 토큰입니다.');
            } else {
                throw new UnauthorizedException(
                    '토큰 검증 중 오류가 발생했습니다.',
                );
            }
        }
    }

    //토큰 재발급
    rotateToken(token: string, isRefreshToken: boolean) {
        const decoded = this.verifyToken(token);
        if (decoded.type !== 'refresh') {
            throw new UnauthorizedException(
                'Access Token으로는 발급이 불가합니다.',
            );
        }
        return this.signToken({ ...decoded }, isRefreshToken);
    }
}
