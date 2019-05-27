import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PlaylistService } from "../services/PlaylistService";
import { Playlist } from "../entities/Playlist";
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';

@ApiUseTags('Playlist')
@Controller('/api/v1/playlists')
export class PlaylistController {

    constructor(private playlistService: PlaylistService ){}

    @Post()
    @ApiOperation({
        title: 'Create Playlist',
        description: 'The API to create playlist'
    })
    async create(@Body() podcast: Playlist){
        return this.playlistService.create(podcast);
    }

    @Get()
    @ApiOperation({
        title: 'Get Playlist',
        description: 'The API to list all playlist'
    })
    index(): Promise<Playlist[]>{
        return this.playlistService.findAll();
    }

    @Put(':id')
    @ApiOperation({
        title: 'Update Playlist',
        description: 'The API to update data playlist'
    })
    async update(@Param('id') id: number, @Body() podcast: Playlist): Promise<any>{
        return this.playlistService.update(id, podcast);
    }

    @Delete(':id')
    @ApiOperation({
        title: 'Delete Playlist',
        description: 'The API to delete data playlist'
    })
    async delete(@Param('id') id: number): Promise<any>{
        return this.playlistService.delete(id);
    }

}
