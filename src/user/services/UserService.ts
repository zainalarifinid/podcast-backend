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
        var formatEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!formatEmail.test(String(user.email).toLowerCase())){
            throw new HttpException('Email is invalid format', HttpStatus.BAD_REQUEST);
        }

        const checkEmail = await this.userRepository.findOne({email: user.email});
        const checkUsername = await this.userRepository.findOne({username: user.username});
        // const dummyData = await this.userRepository.findOne(1);
        // const dummyData2 = await this.userRepository.findOne(2);
        console.log(this.userRepository, checkEmail, checkUsername);
        if(!!checkEmail && typeof(checkEmail) != 'undefined'){
            throw new HttpException('Email is exist', HttpStatus.BAD_REQUEST);
        }

        if(!!checkUsername && typeof(checkUsername) != 'undefined' ){
            throw new HttpException('Username is exist', HttpStatus.BAD_REQUEST);
        }
        
        return await this.userRepository.save(user);
    }

}
