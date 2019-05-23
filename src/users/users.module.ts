import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { userProvider } from "./user.providers";
import { UsersController } from "./users.controller";
import { UserService } from "./user.service";

@Module({
    imports: [ DatabaseModule ],
    controllers: [ UsersController ],
    providers: [
        ...userProvider,
        UserService,
    ],
})

export class UsersModule {}

