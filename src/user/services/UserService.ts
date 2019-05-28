import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../entities/User";

@Injectable()
export class UserService{
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async create(user: User): Promise<User> {
        if(user.email.length == 0){
            throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);            
        }
        if(user.username.length == 0){
            throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);            
        }
        return await this.userRepository.save(user);
    }

}
