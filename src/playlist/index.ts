import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { PlaylistController } from "./controllers/PlaylistController";
import { PlaylistService } from "./services/PlaylistService";
import { playlistProvider } from "./providers/PlaylistProvider";

@Module({
    imports: [ DatabaseModule ],
    controllers: [PlaylistController],
    providers: [
        ...playlistProvider,
        PlaylistService,
    ]
  })
  export class PlaylistModule {}
