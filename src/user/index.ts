import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { userProvider } from "./providers/UserProvider";
import { UsersController } from "./controllers/UserController";
import { UserService } from "./services/UserService";

@Module({
    imports: [ DatabaseModule ],
    controllers: [ UsersController ],
    providers: [
        ...userProvider,
        UserService,
    ],
})

export class UsersModule {}

