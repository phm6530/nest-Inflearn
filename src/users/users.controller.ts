import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModel } from 'src/users/entities/users.entity';

export class CreateUserDto {
    nickname: string;
    email: string;
    password: string;
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    postUser(@Body() createUserDto: CreateUserDto) {
        const { nickname, email, password } = createUserDto;
        return this.usersService.createUser(nickname, email, password);
    }

    @Get()
    getUsers() {
        return this.usersService.getUsers();
    }
}
