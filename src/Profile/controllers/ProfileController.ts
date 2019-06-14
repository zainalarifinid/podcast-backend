import { Controller, Get, Param, Post, Body, Inject, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProfileService } from "../services/ProfileService";
import { Follower } from "../entities/Follower.dto";
import { ApiUseTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiUseTags('Profile')
@Controller('/api/v1/profile')
export class ProfileController {

    constructor(
        @Inject("PodcastApp.ProfileService")
        private profileService: ProfileService
    ){}

    @Get(':username/:username2')
    @ApiOperation({
        title: 'Get Profile',
        description: 'The API to list data user and status following user'
    })
    async getProfile(@Param('username2') usernameFollower: string, @Param('username') usernameFollowing: string ){
        return this.profileService.getProfile(usernameFollower, usernameFollowing);
    }

    @Post(':username/follow')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Follow User',
        description: 'The API to set status following user'
    })
    async follow(@Body() follower: Follower, @Param('username') usernameFollowing: string){        
        return this.profileService.follow(follower.usernameFollower, usernameFollowing);
    }

    @Post(':username/unfollow')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Unfollow User',
        description: 'The API to set status unfollowing user'
    })
    async unfollow(@Body() follower: Follower, @Param('username') usernameFollowing: string){
        return this.profileService.unfollow(follower.usernameFollower, usernameFollowing);
    }


}
