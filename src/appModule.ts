import { Module } from '@nestjs/common';
import { UsersModule } from "./user";
import { PodcastsModule } from './podcast';
import { PlaylistModule } from "./playlist";
import { ProfileModule } from './profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth';

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
