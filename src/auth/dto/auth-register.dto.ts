import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsString, Length } from 'class-validator';
import { UsersModel } from 'src/users/entities/users.entity';
import { vaildateMessage } from 'src/util/message';

export class RegisterUserDto extends PickType(UsersModel, [
    'email',
    'nickname',
    'password',
]) {
    @Length(1, 20, { message: vaildateMessage().validateLength })
    nickname: string;

    @IsEmail(
        {},
        {
            message: vaildateMessage().vaildateEmail,
        },
    )
    email: string;

    @IsString()
    password: string;
}
