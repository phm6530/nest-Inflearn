import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';

export class CreateUserDto {
    nickname: string;
    email: string;
    password: string;
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     *
     * Serializer 직렬화
     * Request
     *
     */
    @Get()
    getUsers() {
        return this.usersService.getUsers();
    }
}
