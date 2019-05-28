import { Injectable, Inject } from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { Playlist } from "../entities/Playlist";
import { Podcast } from 'src/podcast/entities/Podcast';

@Injectable()
export class PlaylistService{

    constructor(
        @Inject('PLAYLIST_REPOSITORY')
        private readonly playlistRepository: Repository<Playlist>,
        @Inject('PODCAST_REPOSITORY')
        private readonly podcastRepository: Repository<Podcast>
    ) {}

    async findAll(): Promise<Playlist[]> {
        return await this.playlistRepository.find();
    }

    async create(playlist: Playlist): Promise<Playlist> {
        return await this.playlistRepository.save(playlist);
    }

    async update(id, playlist: Playlist): Promise<UpdateResult> {
        return await this.playlistRepository.update(id, playlist);
    }

    async delete( id ): Promise<DeleteResult> {
        return await this.playlistRepository.delete(parseInt(id));
    }


    async addPlayList(idPlaylist: number, idPodcast: number): Promise<Playlist> {
        const playlist = await this.playlistRepository.findOne(idPlaylist);
        const podcast  = await this.podcastRepository.findOne(idPodcast)
        if(Array.isArray(playlist.podcasts)){
            playlist.podcasts.push(podcast);
        }else{
            playlist.podcasts = [ podcast ];
        }

        await this.playlistRepository.save(playlist);

        return playlist;

    }

    async removePlaylist(idPlaylist: number, idPodcast: number): Promise<Playlist>{
        let playlist = await this.playlistRepository.findOne(idPlaylist);
        const podcast  = await this.podcastRepository.findOne(idPodcast);

        const deleteIndex = playlist.podcasts.findIndex( _podcast => _podcast.id == podcast.id );

        if(deleteIndex >= 0){
            playlist.podcasts.splice(deleteIndex, 1);
            playlist = await this.playlistRepository.save(playlist);
        }

        return playlist;

    }
}
