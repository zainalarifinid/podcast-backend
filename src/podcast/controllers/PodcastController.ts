import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PodcastsService } from '../services/PodcastService';
import { Podcast } from '../entities/Podcast';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';

@ApiUseTags('Podcast')
@Controller('/api/v1/podcasts')
export class PodcastController {

    constructor(private podcastService: PodcastsService){}

    @Post()
    @ApiOperation({
        title: 'Create Podcast',
        description: 'The API to create podcast'
    })
    async create(@Param('id') id: number, @Body() podcast: Podcast){
        return this.podcastService.create(id, podcast);
    }

    @Get()
    @ApiOperation({
        title: 'Get Podcast',
        description: 'The API to get all podcasts'
    })
    index(): Promise<Podcast[]>{
        return this.podcastService.findAll();
    }

    @Put(':id')
    @ApiOperation({
        title: 'Update Podcast',
        description: 'The API to update data podcast'
    })
    async update(@Param('id') id: number, @Body() podcast: Podcast): Promise<any>{
        return this.podcastService.update(id, podcast);
    }

    @Delete(':id')
    @ApiOperation({
        title: 'Delete Podcast',
        description: 'The API to delete data podcast'
    })
    async delete(@Param('id') id: number): Promise<any>{
        return this.podcastService.delete(id);
    }

}
