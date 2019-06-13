import { AuthService } from "./services/AuthService";
import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/authController";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "..//user";

const AuthServiceProvider = {
    provide: 'PodcastApp.AuthService',
    useClass: AuthService,
};

@Module({
    controllers: [ AuthController ],
    imports: [ UsersModule ],
    providers: [ AuthServiceProvider ],
    exports: [ AuthServiceProvider ]
})

export class AuthModule {}
