import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/UserController";
import { UserService } from "./services/UserService";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/User";
import { UserRepository } from "./repositories";

const userServiceProvider = {
    provide: 'PodcastApp.UserService',
    useClass: UserService,
};

@Module({
    controllers: [ UsersController ],
    imports: [ TypeOrmModule.forFeature([User, UserRepository]) ],
    providers: [ userServiceProvider ],
    exports: [ userServiceProvider ]
    // imports: [ DatabaseModule ],
    // controllers: [ UsersController ],
    // providers: [
    //     userProvider,
    //     UserService,
    // ],
    // exports: [
    //     userProvider,
    // ],
})

export class UsersModule {}

