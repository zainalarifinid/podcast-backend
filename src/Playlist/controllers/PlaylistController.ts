import { Controller, Get, Post, Put, Delete, Body, Param, Inject, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { PlaylistService } from "../services/PlaylistService";
import { Playlist } from "../entities/Playlist";
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../../User/entities/User';

@ApiUseTags('Playlist')
@Controller('/api/v1/playlists')
export class PlaylistController {

    constructor(
        @Inject("PodcastApp.PlaylistService")
        private playlistService: PlaylistService 
    ){}

    @Post(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Create Playlist',
        description: 'The API to create playlist'
    })
    async create(@Req() request: User, @Body() podcast: Playlist){
        return this.playlistService.create(request.id, podcast);
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
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Update Playlist',
        description: 'The API to update data playlist'
    })
    async update(@Req() request: User, @Body() podcast: Playlist): Promise<any>{
        return this.playlistService.update(request.id, podcast);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Delete Playlist',
        description: 'The API to delete data playlist'
    })
    async delete(@Param('id') id: number): Promise<any>{
        return this.playlistService.delete(id);
    }

    @Post(':id/add-playlist/:idPodcast')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Add Podcast to Playlist',
        description: 'The API to add podcast to playlist'
    })
    async addPlayList(@Param('id') id: number, @Param('idPodcast') idPodcast: number): Promise<Playlist>{
        return this.playlistService.addPlayList(id, idPodcast);
    }

    @Post(':id/remove-playlist/:idPodcast')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Remove Podcast to Playlist',
        description: 'The API to remove podcast from playlist'
    })
    async removePlaylist(@Param('id') id: number, @Param('idPodcast') idPodcast: number): Promise<Playlist>{
        return this.playlistService.removePlaylist(id, idPodcast);
    }

}
