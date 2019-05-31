import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DeleteResult, UpdateResult } from "typeorm";
import { Playlist } from "../entities/Playlist";
import { Podcast } from '../../podcast/entities/Podcast';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistRepository } from '../repositories';
import { PodcastRepository } from '../../podcast/repositories';
import { User } from '../../user/entities/User';
import { UserRepository } from '../../user/repositories';

@Injectable()
export class PlaylistService{

    constructor(
        @InjectRepository(Playlist)
        private readonly playlistRepository: PlaylistRepository,
        @InjectRepository(Podcast)
        private readonly podcastRepository: PodcastRepository,
        @InjectRepository(User)
        private readonly userRepository: UserRepository,
    ) {}

    async findAll(): Promise<Playlist[]> {
        return await this.playlistRepository.find();
    }

    async create(idUser: number, playlist: Playlist): Promise<Playlist> {
        
        playlist.title = (playlist.title.length == 0)? "Untitled" : playlist.title;

        const checkTitle = await this.playlistRepository.findOne({title: playlist.title});
        if(!!checkTitle){
            
            throw new HttpException('Title is exist', HttpStatus.BAD_REQUEST);
            
        }

        const newPlaylist = await this.playlistRepository.save(playlist);
        const user = await this.userRepository.findOne(idUser);
        if(Array.isArray(user.playlists)){
            user.playlists.push(newPlaylist);
        }else{
            user.playlists = [ newPlaylist ];
        }

        return newPlaylist

    }

    async update(id, playlist: Playlist): Promise<UpdateResult> {

        const searchPlaylist = await this.playlistRepository.findOne(id);
        //!!playlist mean playlist was empty
        if(!!searchPlaylist == false){
            console.log("throw new HttpException");
            throw new HttpException('Playlist doesn\'t exist', HttpStatus.BAD_REQUEST);
        }

        return await this.playlistRepository.update(id, playlist);
    }

    async delete( id ): Promise<DeleteResult> {

        const searchPlaylist = await this.playlistRepository.findOne(id);
        //!!playlist mean playlist was empty
        if(!!searchPlaylist == false){
            console.log("throw new HttpException");
            throw new HttpException('Playlist doesn\'t exist', HttpStatus.BAD_REQUEST);
        }

        return await this.playlistRepository.delete(parseInt(id));
    }


    async addPlayList(idPlaylist: number, idPodcast: number): Promise<Playlist> {

        const playlist = await this.playlistRepository.findOne(idPlaylist);
        //!!playlist mean playlist was empty
        if(!!playlist == false){
            // console.log("throw new HttpException");
            throw new HttpException('Playlist doesn\'t exist', HttpStatus.BAD_REQUEST);
        }

        const podcast  = await this.podcastRepository.findOne(idPodcast)
        if(Array.isArray(playlist.podcasts)){
            playlist.podcasts.push(podcast);
        }else{
            playlist.podcasts = [ podcast ];
        }

        await this.playlistRepository.save(playlist);
        
        // console.log("pass the HttpException");

        return playlist;

    }

    async removePlaylist(idPlaylist: number, idPodcast: number): Promise<Playlist>{
        let playlist = await this.playlistRepository.findOne(idPlaylist);
        if(!!playlist == false){
            // console.log("throw new HttpException");
            throw new HttpException('Playlist doesn\'t exist', HttpStatus.BAD_REQUEST);
        }
        const podcast  = await this.podcastRepository.findOne(idPodcast);
        if(!!podcast == false){
            // console.log("throw new HttpException");
            throw new HttpException('Podcast doesn\'t exist', HttpStatus.BAD_REQUEST);
        }

        const deleteIndex = playlist.podcasts.findIndex( _podcast => _podcast.id == podcast.id );

        if(deleteIndex >= 0){
            playlist.podcasts.splice(deleteIndex, 1);
            playlist = await this.playlistRepository.save(playlist);
        }

        return playlist;

    }
}
