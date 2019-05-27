import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from "./user";
import { PodcastsModule } from './podcast';
import { PlaylistModule } from "./playlist";
import { ProfileModule } from './profile';

@Module({
  imports: [UsersModule, PodcastsModule, PlaylistModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
