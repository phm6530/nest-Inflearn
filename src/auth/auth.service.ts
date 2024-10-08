import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECERT } from 'src/auth/const/auth.const';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
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
            type: isRefreshToken ? 'refrsh' : 'access',
        };

        return this.jwtService.sign(payload, {
            secret: JWT_SECERT,
            expiresIn: isRefreshToken ? 3600 : 300,
        });
    }

    loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true),
        };
    }

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
    }
}
