import { Module } from '@nestjs/common';
import { PodcastsController } from './controllers/PodcastController';
import { PodcastsService } from './services/PodcastService';
import { DatabaseModule } from '../database/database.module';
import { podcastProvider } from './providers/PodcastProvider';

@Module({
  imports: [ DatabaseModule ],
  controllers: [PodcastsController],
  providers: [
      ...podcastProvider,
      PodcastsService,
  ]
})
export class PodcastsModule {}
