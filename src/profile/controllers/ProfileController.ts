import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { ProfileService } from "../services/ProfileService";
import { Follower } from "../entities/Follower";

@Controller('profile')
export class ProfileController {

    constructor(private profileService: ProfileService){}

    @Get(':username')
    async getProfile(@Body() follower: Follower, @Param('username') usernameFollowing: string ){
        let usernameFollower = follower.usernameFollower;
        return this.profileService.getProfile(usernameFollower, usernameFollowing);
    }

    @Post(':username/follow')
    async follow(@Body() follower: Follower, @Param('username') usernameFollowing: string){
        let usernameFollower = follower.usernameFollower;        
        return this.profileService.follow(usernameFollower, usernameFollowing);
    }

    @Post(':username/unfollow')
    async unfollow(@Body() follower: Follower, @Param('username') usernameFollowing: string){
        let usernameFollower = follower.usernameFollower;
        return this.profileService.unfollow(usernameFollower, usernameFollowing);
    }


}
