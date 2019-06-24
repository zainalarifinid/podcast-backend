import { Controller, Get, Post, Put, Delete, Body, Param, Inject, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { PlaylistService } from "../services/PlaylistService";
import { Playlist, PlaylistPodcastDto } from "../entities";
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../../User/entities/User';

@ApiUseTags('Playlist')
@Controller('/api/v1/playlists')
export class PlaylistController {

    constructor(
        @Inject("PodcastApp.PlaylistService")
        private playlistService: PlaylistService 
    ){}

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Create Playlist',
        description: 'The API to create playlist'
    })
    async create(@Req() request, @Body() playlist: Playlist){
        return this.playlistService.create(request.user.id, playlist);
    }

    @Get()
    @ApiOperation({
        title: 'Get Playlist',
        description: 'The API to list all playlist'
    })
    index(): Promise<Playlist[]>{
        return this.playlistService.findAll();
    }

    @Post('detail-from')
    @ApiOperation({
        title: 'Get list Playlist by user',
        description: 'The API to list playlist from one user'
    })
    async getListPlaylist(@Body() dataPodcast : PlaylistPodcastDto ) {
        return this.playlistService.getListPlaylist(dataPodcast.username, dataPodcast.idPodcast);
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
    async addPlayList(@Param('id') id: number, @Param('idPodcast') idPodcast: number): Promise<any>{
        return this.playlistService.addPlayList(id, idPodcast);
    }

    @Post(':id/remove-playlist/:idPodcast')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        title: 'Remove Podcast to Playlist',
        description: 'The API to remove podcast from playlist'
    })
    async removePlaylist(@Param('id') id: number, @Param('idPodcast') idPodcast: number): Promise<any>{
        return this.playlistService.removePlaylist(id, idPodcast);
    }

    @Get('search/:keyword')
    @ApiOperation({
        title: 'Search Playlist by Keyword',
        description: 'The API to search playlsit by keyword'
    })
    async searchPlaylist(@Param("keyword") keyword: string): Promise<Playlist[]>{
        return this.playlistService.searchPlaylist(keyword);
    }

}
