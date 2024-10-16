import { UsersService } from 'src/users/users.service';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly UsersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const rawToken = req.headers['authorization'];

        if (!rawToken) throw new UnauthorizedException('토큰이 없습니다.');

        const token = this.authService.extractTokenFromHeader(rawToken, true);
        const result = await this.authService.verifyToken(token);

        const user = await this.UsersService.getUserByEmail(result.email);

        req.user = user;
        req.token = token;
        req.tokenType = result.type;

        return true;
    }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        const req = context.switchToHttp().getRequest();

        if (req.tokenType !== 'access')
            throw new UnauthorizedException('Access Token이 아닙니다..');

        return true;
    }
}

@Injectable()
export class RefreshTokenGaurd extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        const req = context.switchToHttp().getRequest();

        if (req.tokenType !== 'refresh')
            throw new UnauthorizedException('refresh Token이 아닙니다..');

        return true;
    }
}
