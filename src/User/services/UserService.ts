import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { User } from '../entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash, compare } from 'bcrypt';
import { LoginUserDto } from '../entities/Login.dto';
import { UserEditDto } from '../entities/UserEdit.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email: email });
  }

  async getDetail(id: number): Promise<User> {
    const dataUser = await this.userRepository.findOne({
      where: { id: id },
      relations: ['podcasts', 'playlists', 'followings'],
    });
    return dataUser;
  }

  async searchUser(username: string): Promise<User[]> {
    const dataUsers = await this.userRepository.find({
      where: { username: Like(`%${username}%`) },
      relations: ['podcasts', 'playlists', 'followings'],
    });
    return dataUsers;
  }

  async create(user: User): Promise<User> {
    if (user.email.length == 0) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    if (user.username.length == 0) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }
    const formatEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!formatEmail.test(String(user.email).toLowerCase())) {
      throw new HttpException(
        'Email is invalid format',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);

    const checkEmail = await this.userRepository.findOne({ email: user.email });
    const checkUsername = await this.userRepository.findOne({
      username: user.username,
    });
    if (!!checkEmail && typeof checkEmail != 'undefined') {
      throw new HttpException('Email is exist', HttpStatus.BAD_REQUEST);
    }

    if (!!checkUsername && typeof checkUsername != 'undefined') {
      throw new HttpException('Username is exist', HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.save(user);
  }

  async updateUser(user: UserEditDto): Promise<any> {
    const dataLoginUser = new LoginUserDto();
    dataLoginUser.email = user.email;
    dataLoginUser.password = user.oldPassword ? user.oldPassword : '';
    // console.log(dataLoginUser);
    if (this.checkPasword(dataLoginUser) || user.password === '') {
      const dataUser = await this.userRepository.findOne({
        select: ['email', 'username', 'password'],
        where: { id: user.id },
      });

      const checkUsername = await this.userRepository.findOne({
        username: user.username,
      });
      if (!!checkUsername && typeof checkUsername !== 'undefined') {
        throw new HttpException('Username is exist', HttpStatus.BAD_REQUEST);
      }

      dataUser.username = user.username;
      dataUser.email = user.email; // email using previous email, it can't be changed

      if (user.password !== '') {
        const salt = await genSalt(10);
        dataUser.password = await hash(user.password, salt);
      }

      delete dataUser.followersCount;
      delete dataUser.followingCount;

      console.log(dataUser);

      return await this.userRepository.update(user.id, dataUser);

    } else {
      throw new HttpException(
        'Wrong your past Password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkPasword(user: LoginUserDto): Promise<Boolean> {
    const dataUser = await this.userRepository.findOne({ email: user.email });
    // console.log(dataUser);
    // console.log(
    //   user.password,
    //   dataUser.password,
    //   compare(user.password, dataUser.password),
    // );
    return compare(user.password, dataUser.password);
  }
}
