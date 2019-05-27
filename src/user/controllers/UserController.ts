import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { User } from "../entities/User";
import { UserService } from "../services/UserService";
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('User')
@Controller('/api/v1/users')
export class UsersController {

    constructor(private userService: UserService){}

    @Post()
    @ApiOperation({
        title: 'Create User',
        description: 'The API to create an user'
    })
    async create(@Body() user: User ){

        return this.userService.create(user);
    }

    @Get()
    @ApiOperation({
        title: 'Get User',
        description: 'The API to get all user'
    })
    index(): Promise<User[]>{
        return this.userService.findAll();
    }

}
