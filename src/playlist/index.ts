import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { PlaylistController } from "./controllers/PlaylistController";
import { PlaylistService } from "./services/PlaylistService";
import { playlistProvider } from "./providers/PlaylistProvider";
import { PodcastsModule } from "../podcast";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlaylistRepository } from "./repositories";
import { Playlist } from "./entities/Playlist";


const playlistServiceProvider = {
    provide: 'PodcastApp.PlaylistService',
    useClass: PlaylistService
}

@Module({
    imports: [ TypeOrmModule.forFeature([Playlist, PlaylistRepository]), PodcastsModule ],
    controllers: [PlaylistController],
    providers: [ playlistServiceProvider ]
  })
  export class PlaylistModule {}
