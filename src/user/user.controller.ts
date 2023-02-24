import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/register')
    async createUser(@Body() body: CreateUserDto) {
        await this.userService.createUser(body);
    }

    @Post('/login')
    async login(@Body() body: LoginUserDto) {
        return await this.userService.login(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/login-check')
    async loginCheck(@Req() req) {
        console.log(req.user);
    }
}
