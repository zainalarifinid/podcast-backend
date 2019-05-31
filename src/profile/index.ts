import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { UsersModule } from "../user";
import { ProfileController } from "./controllers/ProfileController";
import { followProvider } from "./providers/FollowProvider";
import { ProfileService } from "./services/ProfileService";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowRepository } from "./repositories/FollowRepositories";
import { Follow } from "./entities/Follow";

const profileServiceProvider = {
    provide: 'PodcastApp.ProfileService',
    useClass: ProfileService
}

@Module({
    imports: [ TypeOrmModule.forFeature([ Follow, FollowRepository ]), UsersModule ],
    controllers: [ ProfileController ],
    providers: [ profileServiceProvider ]
})
export class ProfileModule {}
