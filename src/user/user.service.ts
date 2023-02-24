import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) {}

    async createUser(body: CreateUserDto) {
        const user = await this.usersRepository.findOne({
            where: { email: body.email },
        });

        if (user) {
            throw new UnauthorizedException('이미 존재하는 사용자입니다.');
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        await this.usersRepository.save({
            email: body.email,
            nickname: body.nickname,
            password: hashedPassword,
        });
    }
}
