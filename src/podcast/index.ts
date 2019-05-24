import { Module } from '@nestjs/common';
import { PodcastController } from './controllers/PodcastController';
import { PodcastsService } from './services/PodcastService';
import { DatabaseModule } from '../database';
import { podcastProvider } from './providers/PodcastProvider';

import { UsersModule } from '../user';

@Module({
  imports: [ DatabaseModule, UsersModule ],
  controllers: [PodcastController],
  providers: [
      ...podcastProvider,
      PodcastsService,
  ]
})
export class PodcastsModule {}
