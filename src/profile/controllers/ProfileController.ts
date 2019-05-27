import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { ProfileService } from "../services/ProfileService";
import { Follower } from "../entities/Follower.dto";

@Controller('profile')
export class ProfileController {

    constructor(private profileService: ProfileService){}

    @Get(':username/:username2')
    async getProfile(@Param('username2') usernameFollower: string, @Param('username') usernameFollowing: string ){
        return this.profileService.getProfile(usernameFollower, usernameFollowing);
    }

    @Post(':username/follow')
    async follow(@Body() follower: Follower, @Param('username') usernameFollowing: string){        
        return this.profileService.follow(follower.usernameFollower, usernameFollowing);
    }

    @Post(':username/unfollow')
    async unfollow(@Body() follower: Follower, @Param('username') usernameFollowing: string){
        return this.profileService.unfollow(follower.usernameFollower, usernameFollowing);
    }


}
