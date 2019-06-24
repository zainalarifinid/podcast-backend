import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DeleteResult, UpdateResult, Like } from "typeorm";
import { Playlist } from "../entities/Playlist";
import { Podcast } from '../../Podcast/entities/Podcast';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistRepository } from '../repositories';
import { PodcastRepository } from '../../Podcast/repositories';
import { User } from '../../User/entities/User';
import { UserRepository } from '../../User/repositories';

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
        return await this.playlistRepository.find({relations: ["podcasts", "user"]});
    }

    async getDetail(idPlaylist: number): Promise<Playlist> {
        return await this.playlistRepository.findOne({where: {id: idPlaylist}, relations: ["podcasts"]})
    }

    async getListPlaylist(username: string, idPodcast: number): Promise<User> {
        // return await this.playlistRepository.find({ where: {id: idUser}, relations: ["playlists"] });
        let dataUser = await this.userRepository.findOne({ where: {username: username}, relations: ["playlists"] });
        const getDetailPodcast = await this.podcastRepository.findOne({ where: {id: idPodcast}, relations: ["playlists"] });

        dataUser.playlists = dataUser.playlists.map( (dataPlaylist) => {
            if( Array.isArray( getDetailPodcast.playlists ) ){
                
                dataPlaylist["inPlaylist"] = ( getDetailPodcast.playlists.filter( (dataPodcast) => dataPodcast.id == dataPlaylist.id ) ).length > 0;

            }else{
                dataPlaylist["inPlaylist"] = false;
            }
            return dataPlaylist;
        });

        return dataUser;
    }

    async searchPlaylist(keyword: string): Promise<Playlist[]> {
        return await this.playlistRepository.find({ relations: ["podcasts"], where: { title: Like(`%${keyword}%`) } });
    }

    async create(idUser: number, playlist: Playlist) {
        
        playlist.title = (playlist.title.length == 0)? "Untitled" : playlist.title;

        const checkTitle = await this.playlistRepository.findOne({title: playlist.title});
        if(!!checkTitle){
            
            throw new HttpException('Title is exist', HttpStatus.BAD_REQUEST);
            
        }
        const user = await this.userRepository.findOne({ where: { id: idUser }, relations: ["playlists"] });
        const newPlaylist = await this.playlistRepository.save(playlist);
        newPlaylist.user = user;
        console.log("check user : ", idUser, user);
        if(user.playlists.length > 0){
            user.playlists.push(newPlaylist);
        }else{
            user.playlists = [ newPlaylist ];
        }

        await this.userRepository.save(user);
        console.log(newPlaylist);
        return {newPlaylist};

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


    async addPlayList(idPlaylist: number, idPodcast: number): Promise<any> {

        let playlist = await this.playlistRepository.findOne({ where: { id: idPlaylist }, relations: ["podcasts"] });
        //!!playlist mean playlist was empty
        if(!!playlist == false){
            // console.log("throw new HttpException");
            throw new HttpException('Playlist doesn\'t exist', HttpStatus.BAD_REQUEST);
        }

        let podcast  = await this.podcastRepository.findOne({ where: { id: idPodcast }, relations: ["playlists"] });

        console.log(playlist);
        console.log(podcast)

        if( playlist.podcasts.length > 0 ){
            playlist.podcasts.push(podcast);
        }else{
            playlist.podcasts = [ podcast ];
        }

        if( podcast.playlists.length > 0 ){
            podcast.playlists.push(playlist);
        }else{
            podcast.playlists = [ playlist ];
        }
        console.log(playlist);
        console.log(podcast);
        await this.playlistRepository.save(playlist);
        await this.podcastRepository.save(podcast);

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
