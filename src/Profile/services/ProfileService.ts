import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Follow } from '../entities/Follow';
import { User } from '../../User/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowRepository } from '../repositories/FollowRepositories';
import { UserRepository } from '../../User/repositories';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: FollowRepository,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async getProfile(username: string): Promise<User> {
    //get profile
    const detailUser = await this.userRepository.findOne({
      where: { username: username },
      relations: ['podcasts', 'playlists', 'followings'],
    });
    if (!!!detailUser) {
      throw new HttpException('account not found', HttpStatus.BAD_REQUEST);
    }

    detailUser.followers = await this.getFollower(username);
    detailUser.followersCount = detailUser.followers.length;

    return detailUser;
  }

  async getFollower(username: string): Promise<any> {
    const getAllUser = await this.userRepository.find({
      relations: ['followings'],
    });

    const returnUser = getAllUser.filter(data => {
      if (data.username !== username) {
        return data.followings.filter(dataFollowing => {
          // console.log( dataFollowing.username, username, dataFollowing.username === username );
          return dataFollowing.username === username;
        });
      }
    });
    // console.log( returnUser );
    return returnUser;
  }

  async getFollowing(username: string): Promise<any> {
    const userFollowing = await this.userRepository.findOne({
      where: { username: username },
      relations: ['followings'],
    });
    return userFollowing.followings;
  }

  async checkFollowing(username: string, userFollowing: string): Promise<any> {
    const checkFollowing = await this.userRepository.findOne({
      where: { username: username },
      relations: ['followings'],
    });

    const returnUser = checkFollowing.followings.filter(data => {
      console.log(data.username, userFollowing);
      return data.username === userFollowing;
    });

    console.log(returnUser);

    return { isFollowing: returnUser.length > 0 };
  }

  async follow(idUser: number, usernameFollowing: string): Promise<User> {
    // console.log(idUser, usernameFollowing);
    if (!idUser || !usernameFollowing) {
      throw new HttpException('account not found', HttpStatus.BAD_REQUEST);
    }

    //get data user follower
    const currentUser = await this.userRepository.findOne({
      where: { id: idUser },
      relations: ['followings'],
    });

    if (currentUser.username == usernameFollowing) {
      throw new HttpException(
        'Follower and following cannot be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    //get data user following
    const userFollowing = await this.userRepository.findOne({
      where: { username: usernameFollowing },
    });
    // console.log(userFollowing);
    if (!!userFollowing == false) {
      throw new HttpException('account not found', HttpStatus.BAD_REQUEST);
    }

    console.log('User Following', currentUser, userFollowing);

    if (currentUser.followings.length > 0) {
      currentUser.followings.push(userFollowing);
    } else {
      currentUser.followings = [userFollowing];
    }

    await this.userRepository.save(currentUser);

    return userFollowing;
  }

  async unfollow(idUser: number, usernameUnfollowing: string): Promise<User> {
    if (!idUser || !usernameUnfollowing) {
      throw new HttpException('Follower not found', HttpStatus.BAD_REQUEST);
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: idUser },
      relations: ['followings'],
    });

    if (currentUser.username == usernameUnfollowing) {
      throw new HttpException(
        'Follower and following cannot be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userUnfollowing = await this.userRepository.findOne({
      where: { username: usernameUnfollowing },
    });
    if (!!userUnfollowing == false) {
      throw new HttpException('account not found', HttpStatus.BAD_REQUEST);
    }

    currentUser.followings = currentUser.followings.filter(obj => {
      return obj.id != userUnfollowing.id;
    });

    // userUnfollowing.followers = userUnfollowing.followers.filter( (obj) => {
    //     return obj.id != idUser;
    // });

    await this.userRepository.save(currentUser);
    await this.userRepository.save(userUnfollowing);

    return userUnfollowing;
  }
}
