import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PodcastController } from './controllers/PodcastController';
import { PodcastsService } from './services/PodcastService';
import { DatabaseModule } from '../database';
import { podcastProvider } from './providers/PodcastProvider';

import { PodcastEntity } from "./entities/Podcast";
import { User } from "../user/entities/User";

@Module({
  imports: [ DatabaseModule ],
  controllers: [PodcastController],
  providers: [
      ...podcastProvider,
      PodcastsService,
  ]
})
export class PodcastsModule {}
