import { AuthService } from "./services/AuthService";
import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/authController";
import { UsersModule } from "../User";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import config from "../../config";
import { JwtStrategy } from "./jwtStrategy";

const AuthServiceProvider = {
    provide: 'PodcastApp.AuthService',
    useClass: AuthService,
};

@Module({
    controllers: [ AuthController ],
    imports: [ 
                PassportModule.register({defaultStrategy: "jwt"}), 
                JwtModule.register({
                    secret: config.jwtPrivateKey,
                    signOptions: {
                        expiresIn: 3600
                    }
                }),
                UsersModule
             ],
    providers: [ AuthServiceProvider, JwtStrategy ],
    exports: [ PassportModule, AuthServiceProvider ]
})

export class AuthModule {}
