import { Controller, Get, Post, Body, Query, Put, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UserService } from "./user.service";
import { Response } from 'express';

@Controller('users')
export class UsersController {

    @Post()
    async create(@Body() createUserDto: CreateUserDto ){

        return "Success Create User";
    }

    /* @Post()
    async create(@Body() createUserDto: CreateUserDto, @Res() res: Response ){

        res.status(HttpStatus.CREATED).send();
    } */

    @Get()
    findAll(): string{
        return "Default GET for User Controller";
    }

    // @Get()
    // findAll(@Query() query: ListAllEntities) {
    //     return `This action returns all cats (limit: ${query.limit} items)`;
    // }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return `This action returns a #${id} cat`;
    }

}
