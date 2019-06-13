import { Module } from '@nestjs/common';
import { UsersModule } from "./User";
import { PodcastsModule } from './Podcast';
import { PlaylistModule } from "./Playlist";
import { ProfileModule } from './Profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './Auth';

@Module({
  imports: [
              UsersModule, 
              PodcastsModule, 
              PlaylistModule, 
              ProfileModule, 
              AuthModule,
              TypeOrmModule.forRoot({
                type: 'sqlite',
                database: process.env.NODE_ENV === 'test' ? ':memory:' : 'db',
                entities: [
                    __dirname + '/../../**/entities/**{.ts,.js}',
                ],
              synchronize: true,
              })
           ]
})
export class AppModule {}
