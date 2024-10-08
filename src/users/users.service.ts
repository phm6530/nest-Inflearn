import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly userRepository: Repository<UsersModel>,
    ) {}

    async createUser(
        user: Pick<UsersModel, 'nickname' | 'email' | 'password'>,
    ) {
        const { nickname, email, password } = user;
        const emailExist = await this.userRepository.exists({
            where: { email },
        });

        if (emailExist) throw new BadRequestException('이미 존재하는 이메일');

        //exist 존재하는지
        const nickNameExist = await this.userRepository.exists({
            where: { nickname },
        });

        if (nickNameExist)
            throw new BadRequestException('이미 존재하는 닉네임');

        //create는 Promise 반환 안함
        const newUser = this.userRepository.create({
            nickname,
            email,
            password,
        });

        return await this.userRepository.save(newUser);
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
