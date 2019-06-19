import { Controller, Get, Param, Post, Body, Inject, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProfileService } from "../services/ProfileService";
import { Follower } from "../entities/Follower.dto";
import { ApiUseTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { User } from "../../User/entities/User";
import { UserDto } from "../../User/entities/User.dto";

@ApiUseTags('Profile')
@Controller('/api/v1/profile')
export class ProfileController {

    constructor(
        @Inject("PodcastApp.ProfileService")
        private profileService: ProfileService
    ){}

    @Get(':username')
    @ApiOperation({
        title: 'Get Profile',
        description: 'The API to list data user and status following user'
    })
    async getProfile(
            @Req() request: UserDto,
            @Param('username') usernameFollowing: string 
    ){
        // return this.profileService.getProfile(request.id, usernameFollowing);
    }

    @Get("follower/:username")
    @ApiOperation({
        title: 'Get Follower',
        description: 'The API to list data follower'
    })
    async getFollower(
        @Param("username") username: string
    ):Promise<User[]>{
        return this.profileService.getFollower(username);
    }
    
    @Get("following/:username")
    @ApiOperation({
        title: 'Get Follower',
        description: 'The API to list data follower'
    })
    async getFollowing(
        @Param("username") username: string
    ):Promise<User[]>{
        return this.profileService.getFollowing(username);
    }

    @Post('follow/:username')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Follow User',
        description: 'The API to set status following user'
    })
    async follow(
            @Req() request: any, 
            @Param('username') username: string
    ): Promise<User>{        
        return this.profileService.follow(request.user.id, username);
    }

    @Post('unfollow/:username')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Unfollow User',
        description: 'The API to set status unfollowing user'
    })
    async unfollow(
            @Req() request: any, 
            @Param('username') username: string
    ): Promise<User>{
        return this.profileService.unfollow(request.user.id, username);
    }


}
