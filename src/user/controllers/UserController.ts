import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { User } from "../entities/User";
import { UserService } from "../services/UserService";

@Controller('users')
export class UsersController {

    constructor(private userService: UserService){}

    @Post()
    async create(@Body() user: User ){

        return this.userService.create(user);
    }

    @Get()
    index(): Promise<User[]>{
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return `This action returns a #${id} cat`;
    }

}
