import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicGaurd } from 'src/auth/guard/basic-token.guard';
import { RefreshTokenGaurd } from 'src/auth/guard/bearer-token.guard';
import { RegisterUserDto } from 'src/auth/dto/auth-register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    //access Token 생성
    @Post('token/access')
    @UseGuards(RefreshTokenGaurd)
    postTokenAccess(@Headers('authorization') rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, true);
        const newAccessToken = this.authService.rotateToken(token, false);

        /**
         * 신규 토큰 생성 리턴-
         * {accessToken : {token}}
         */

        return {
            accessToken: newAccessToken,
        };
    }

    @Post('token/refresh')
    @UseGuards(RefreshTokenGaurd)
    postTokenRefresh(@Headers('authorization') rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, true);
        const newRefreshToken = this.authService.rotateToken(token, true);

        /**
         * 신규 토큰 생성 리턴-
         * {accessToken : {token}}
         */
        return {
            refreshToken: newRefreshToken,
        };
    }

    //로그인
    @Post('login/email')
    @UseGuards(BasicGaurd)
    loginEmail(
        @Headers('authorization') rawToken: string,
        // @Body('email') email: string,
        // @Body('password') password: string,
    ) {
        const token = this.authService.extractTokenFromHeader(rawToken, false);
        const { email, password } = this.authService.decodeBasicToken(token);
        return this.authService.loginWithEmail({ email, password });
    }

    //회원가입
    @Post('login/register')
    registerEmail(@Body() body: RegisterUserDto) {
        return this.authService.registerWithEmail(body);
    }
}
