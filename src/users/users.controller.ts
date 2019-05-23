import { Controller, Get, Post, Body, Query, Put, Param, Delete, Res, HttpStatus } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { User } from "./dto/user.entity";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";
import { Response } from 'express';

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
