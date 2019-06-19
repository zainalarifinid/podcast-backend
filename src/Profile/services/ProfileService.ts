import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { Follow } from "../entities/Follow";
import { User } from "../../User/entities/User";
import { ProfileRO, ProfileData } from "../interfaces/FollowInterface";
import { InjectRepository } from "@nestjs/typeorm";
import { FollowRepository } from "../repositories/FollowRepositories";
import { UserRepository } from "../../User/repositories";

@Injectable()
export class ProfileService{
    constructor(
        @InjectRepository(Follow)
        private readonly followRepository: FollowRepository,
        @InjectRepository(User)
        private readonly userRepository: UserRepository
    ){}

    // async getProfile(usernameFollower: number, usernameFollowing: string): Promise<User>{
    //     //get profile
    //     const userFollower = await this.userRepository.findOne({id: usernameFollower});
    //     const userFollowing = await this.userRepository.findOne({relations: ['following']});
    //     console.log(userFollowing);
    //     if(!!userFollowing == false){
    //         throw new HttpException('account not found', HttpStatus.BAD_REQUEST);
    //     }


    //     return userFollowing;

    //     //check user following
    //     // const checkFollowing = await this.followRepository.findOne({followerId: userFollower.id, FollowingId: userFollowing.id});

    //     //merge data profile and following stat
    //     // let profile: ProfileData = {
    //     //     username: usernameFollowing,
    //     //     podcasts: userFollowing.podcasts,
    //     //     following: !!checkFollowing
    //     // };

    //     //return the data
    //     // return {profile}; 
        
    // }

    async getFollower(username: string): Promise<User[]> {
        return await this.userRepository.find({ where: { username: username }, relations: ["followers"] });
    }

    async getFollowing(username: string): Promise<User[]> {
        return await this.userRepository.find({ where: { username: username }, relations: ["followings"] });
    }

    async follow(idUser: number, usernameFollowing: string): Promise<User>{
        // console.log(idUser, usernameFollowing);
        if(!idUser || !usernameFollowing){
            throw new HttpException('account not found', HttpStatus.BAD_REQUEST);
        }

        //get data user follower
        const currentUser = await this.userRepository.findOne({ where: {id: idUser}, relations: ["followings"] });

        if(currentUser.username == usernameFollowing){
            throw new HttpException('Follower and following cannot be equal', HttpStatus.BAD_REQUEST);
        }

        //get data user following
        const userFollowing = await this.userRepository.findOne({ where: {username: usernameFollowing}, relations: ["followers"] });
        // console.log(userFollowing);
        if(!!userFollowing == false){
            throw new HttpException('account not found', HttpStatus.BAD_REQUEST);
        }

        console.log("User Following", currentUser, userFollowing);

        if(currentUser.followings.length > 0){
            currentUser.followings.push(userFollowing);
        }else{
            currentUser.followings = [ userFollowing ];
        }

        if(userFollowing.followers.length > 0){
            userFollowing.followers.push(currentUser);
        }else{
            userFollowing.followers = [ currentUser ];
        }

        await this.userRepository.save(currentUser);
        await this.userRepository.save(userFollowing);

        return userFollowing;
    }

    async unfollow(idUser: number, usernameUnfollowing: string): Promise<User>{

        if(!idUser || !usernameUnfollowing){
            throw new HttpException('Follower not found', HttpStatus.BAD_REQUEST);
        }

        const currentUser = await this.userRepository.findOne({ where: {id: idUser}, relations: ["followings"] });

        if(currentUser.username == usernameUnfollowing){
            throw new HttpException('Follower and following cannot be equal', HttpStatus.BAD_REQUEST);
        }

        const userUnfollowing = await this.userRepository.findOne({ where: {username: usernameUnfollowing}, relations: ["followers"] });
        if(!!userUnfollowing == false){
            throw new HttpException('account not found', HttpStatus.BAD_REQUEST);
        }

        currentUser.followings = currentUser.followings.filter( (obj) => {
            return obj.id != userUnfollowing.id;
        });

        userUnfollowing.followers = userUnfollowing.followers.filter( (obj) => {
            return obj.id != idUser;
        });

        await this.userRepository.save(currentUser);
        await this.userRepository.save(userUnfollowing);

        return userUnfollowing;
    }

}
