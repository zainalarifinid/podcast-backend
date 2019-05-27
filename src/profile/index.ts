import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { UsersModule } from "../user";
import { ProfileController } from "./controllers/ProfileController";
import { followProvider } from "./providers/FollowProvider";
import { ProfileService } from "./services/ProfileService";

@Module({
    imports: [ DatabaseModule, UsersModule ],
    controllers: [ ProfileController ],
    providers: [
        followProvider,
        ProfileService
    ]
})
export class ProfileModule {}
