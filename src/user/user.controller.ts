import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/register')
    async createUser(@Body() body: CreateUserDto) {
        await this.userService.createUser(body);
    }
}
