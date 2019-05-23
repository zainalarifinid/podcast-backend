import { Module } from '@nestjs/common';
import { PodcastsController } from './podcasts.controller';
import { PodcastsService } from './podcasts.service';
import { DatabaseModule } from '../database/database.module';
import { podcastProvider } from './podcast.providers';

@Module({
  imports: [ DatabaseModule ],
  controllers: [PodcastsController],
  providers: [
      ...podcastProvider,
      PodcastsService,
  ]
})
export class PodcastsModule {}
