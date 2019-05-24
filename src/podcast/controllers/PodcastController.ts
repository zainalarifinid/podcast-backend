import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PodcastsService } from '../services/PodcastService';
import { Podcast } from '../entities/Podcast';

@Controller('podcasts')
export class PodcastController {

    constructor(private podcastService: PodcastsService){}

    @Post()
    async create(@Param('id') id: number, @Body() podcast: Podcast){
        return this.podcastService.create(id, podcast);
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
