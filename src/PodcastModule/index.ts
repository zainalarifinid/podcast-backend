import { Module } from '@nestjs/common';
import { PodcastController } from './controllers/PodcastController';
import { PodcastService } from './services/PodcastService';

import { UsersModule } from '../UserModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './entities/Podcast';
import { PodcastRepository } from './repositories';

const podcastServiceProvider = {
    provide: 'PodcastApp.PodcastService',
    useClass: PodcastService
}

@Module({
  imports: [ TypeOrmModule.forFeature([Podcast, PodcastRepository]), UsersModule ],
  controllers: [PodcastController],
  providers: [ podcastServiceProvider ],
  exports: [ podcastServiceProvider ]
})
export class PodcastsModule {}
