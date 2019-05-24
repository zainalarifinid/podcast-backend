import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from "./user";
import { PodcastsModule } from './podcast';

@Module({
  imports: [UsersModule, PodcastsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
