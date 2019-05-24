import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PlaylistService } from "../services/PlaylistService";
import { Playlist } from "../entities/Playlist";

@Controller('playlists')
export class PlaylistController {

    constructor(private playlistService: PlaylistService ){}

    @Post()
    async create(@Body() podcast: Playlist){
        return this.playlistService.create(podcast);
    }

    @Get()
    index(): Promise<Playlist[]>{
        return this.playlistService.findAll();
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() podcast: Playlist): Promise<any>{
        return this.playlistService.update(id, podcast);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<any>{
        return this.playlistService.delete(id);
    }

}
