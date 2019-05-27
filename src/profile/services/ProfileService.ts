import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { Follow } from "../entities/Follow";
import { User } from "../../user/entities/User";
import { ProfileRO, ProfileData } from "../interfaces/FollowInterface";
import { followProvider } from "../providers/FollowProvider";

@Injectable()
export class ProfileService{
    constructor(
        @Inject('FOLLOW_REPOSITORY')
        private readonly followRepository: Repository<Follow>,
        @Inject('USER_REPOSITORY')
        private readonly userRepository: Repository<User>
    ){}

    async getProfile(usernameFollower: string, usernameFollowing: string): Promise<ProfileRO>{
        //get profile
        const userFollower = await this.userRepository.findOne({username: usernameFollower});
        const userFollowing = await this.userRepository.findOne({username: usernameFollowing});
        if(!userFollower || !userFollowing){
            throw new HttpException('account not found', HttpStatus.BAD_REQUEST);
        }

        //check user following
        const checkFollowing = await this.followRepository.findOne({followerId: userFollower.id, FollowingId: userFollowing.id});

        //merge data profile and following stat
        let profile: ProfileData = {
            username: usernameFollowing,
            podcasts: userFollowing.podcasts,
            following: !!checkFollowing
        };

        //return the data
        return {profile}; 
        
    }

    async follow(usernameFollower: string, usernameFollowing: string): Promise<ProfileRO>{

        if(!usernameFollower || !usernameFollowing){
            throw new HttpException('account not found', HttpStatus.BAD_REQUEST);
        }
        if(usernameFollower == usernameFollowing){
            throw new HttpException('Follower and following cannot be equal', HttpStatus.BAD_REQUEST);
        }

        //get data user follower
        const userFollower = await this.userRepository.findOne({username: usernameFollower});

        //get data user following
        const userFollowing = await this.userRepository.findOne({username: usernameFollowing});
        
        //make relation follower
        let isFollowing = await this.followRepository.findOne({followerId: userFollower.id, FollowingId: userFollowing.id });

        let following = isFollowing;
        if(!isFollowing){
            following = new Follow();
            following.followerId = userFollower.id;
            following.FollowingId = userFollowing.id;
            await this.followRepository.save(following);
        }

        let profile: ProfileData = {
            username: userFollowing.username,
            podcasts: userFollowing.podcasts,
            following: true
        };

        return {profile};
    }

    async unfollow(usernameFollower: string, usernameUnfollowing: string): Promise<ProfileRO>{

        if(!usernameFollower || !usernameUnfollowing){
            throw new HttpException('Follower not found', HttpStatus.BAD_REQUEST);
        }
        if(usernameFollower == usernameUnfollowing){
            throw new HttpException('Follower and following cannot be equal', HttpStatus.BAD_REQUEST);
        }

        const userFollowing = await this.userRepository.findOne({username: usernameFollower});

        const userUnfollowing = await this.userRepository.findOne({username: usernameUnfollowing});

        await this.followRepository.delete({followerId: userFollowing.id, FollowingId: userUnfollowing.id});

        let profile: ProfileData = {
            username: userUnfollowing.username,
            podcasts: userUnfollowing.podcasts,
            following: false
        };

        return {profile};
    }

}
