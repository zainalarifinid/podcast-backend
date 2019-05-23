import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PodcastsService } from './podcasts.service';
import { Podcast } from './podcast.entity';

@Controller('podcasts')
export class PodcastsController {

    constructor(private podcastService: PodcastsService){}

    @Post()
    async create(@Body() podcast: Podcast){
        return this.podcastService.create(podcast);
    }

    @Get()
    index(): Promise<Podcast[]>{
        return this.podcastService.findAll();
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() podcast: Podcast): Promise<any>{
        return this.podcastService.update(id, podcast);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<any>{
        return this.podcastService.delete(id);
    }

}
