import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { PlaylistController } from "./controllers/PlaylistController";
import { PlaylistService } from "./services/PlaylistService";
import { playlistProvider } from "./providers/PlaylistProvider";
import { PodcastsModule } from "../podcast";

@Module({
    imports: [ DatabaseModule, PodcastsModule ],
    controllers: [PlaylistController],
    providers: [
        ...playlistProvider,
        PlaylistService,
    ]
  })
  export class PlaylistModule {}
