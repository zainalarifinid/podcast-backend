import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/UserController";
import { UserService } from "./services/UserService";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/User";
import { UserRepository } from "./repositories";
import { USER_SERVICE } from "./constants";

const userServiceProvider = {
    provide: USER_SERVICE,
    useClass: UserService,
};

@Module({
    controllers: [ UsersController ],
    imports: [ TypeOrmModule.forFeature([User, UserRepository]) ],
    providers: [ userServiceProvider ],
    exports: [ userServiceProvider ]
})

export class UsersModule {}

