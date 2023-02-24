import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        private jwtService: JwtService,
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

    async login(body: LoginUserDto) {
        const user = await this.usersRepository.findOne({
            where: { email: body.email, deletedAt: null },
            select: ['id', 'email', 'nickname', 'password'],
        });

        if (!user) {
            throw new NotFoundException('존재하지 않는 사용자입니다.');
        }

        const passwordCompareResult = await bcrypt.compare(
            body.password,
            user.password,
        );

        if (!passwordCompareResult) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }

        const payload = {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return accessToken;
    }
}
