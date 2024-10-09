import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
} from '@nestjs/common';
import { UsersModel } from 'src/users/entities/users.entity';

//사용자 정보 추출
export const User = createParamDecorator(
    (data: keyof UsersModel | undefined, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        console.log(user[data]);
        if (!user) throw new InternalServerErrorException('server Error..');

        return user;
    },
);
