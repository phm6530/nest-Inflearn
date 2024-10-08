import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

export class CreateUserDto {
    nickname: string;
    email: string;
    password: string;
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getUsers() {
        return this.usersService.getUsers();
    }
}
