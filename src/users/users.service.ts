import { Body, Delete, Get, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly userRepository: Repository<UsersModel>,
    ) {}

    async createUser(nickname: string, email: string, password: string) {
        //create는 Promise 반환 안함
        const user = this.userRepository.create({
            nickname,
            email,
            password,
        });

        return await this.userRepository.save(user);
    }

    async getUsers() {
        return this.userRepository.find({});
    }

    async getUserByEmail(email: string) {
        return this.userRepository.findOne({
            where: {
                email,
            },
        });
    }
}
