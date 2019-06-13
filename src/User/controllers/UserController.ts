import { Controller, Get, Post, Body, Param, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from "../entities/User";
import { UserService } from "../services/UserService";
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('User')
@Controller('/api/v1/users')
export class UsersController {

    constructor(
        @Inject("PodcastApp.UserService")
        private userService: UserService
    ){}

    @Post()
    @ApiOperation({
        title: 'Create User',
        description: 'The API to create an user'
    })
    async create(@Body() user: User ){

        return this.userService.create(user);
    }

    @Get()
    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Get User',
        description: 'The API to get all user'
    })
    index(): Promise<User[]>{
        return this.userService.findAll();
    }

}
