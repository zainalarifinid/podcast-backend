import { Injectable, Inject } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./dto/user.entity";

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
        return await this.userRepository.save(user);
    }

}
