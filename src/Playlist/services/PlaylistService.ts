import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DeleteResult, UpdateResult, Like } from 'typeorm';
import { Playlist } from '../entities/Playlist';
import { Podcast } from '../../Podcast/entities/Podcast';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistRepository } from '../repositories';
import { PodcastRepository } from '../../Podcast/repositories';
import { User } from '../../User/entities/User';
import { UserRepository } from '../../User/repositories';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private readonly playlistRepository: PlaylistRepository,
        @InjectRepository(Podcast)
        private readonly podcastRepository: PodcastRepository,
        @InjectRepository(User)
        private readonly userRepository: UserRepository,
    ) {}

    async checkPrivilege(idUser: number, idPlaylist: number): Promise<boolean> {
        const dataUser = await this.userRepository.findOne({
            where: { id: idUser },
            relations: ['playlists'],
        });

        const checkExistPlaylist = dataUser.playlists.filter(
            data => data.id === idPlaylist,
        );
        // console.log( "checkPrivilege", checkExistPlaylist.length > 0 );
        return checkExistPlaylist.length > 0;
    }

    async checkPlaylistExist(idPlaylist: number): Promise<boolean> {
        const searchPlaylist = await this.playlistRepository.findOne(
            idPlaylist,
        );
        // !!playlist mean playlist was empty and !!!searchPlaylist mean playlist is not exist
        // console.log(
        //     searchPlaylist,
        //     !searchPlaylist,
        //     !!searchPlaylist,
        //     !!!searchPlaylist,
        // );
        return !!!searchPlaylist;
    }

    async checkPlaylistExistByTitle(title: string): Promise<boolean> {
        const checkTitle = await this.playlistRepository.findOne({
            title,
        });
        return checkTitle !== null;
    }

    async checkPodcastExist(idPodcast: number): Promise<boolean> {
        const searchPodcast = await this.podcastRepository.findOne({
            id: idPodcast,
        });
        return !!!searchPodcast;
    }

    async findAll(): Promise<Playlist[]> {
        return await this.playlistRepository.find({
            relations: ['podcasts', 'user'],
        });
    }

    async getDetail(idPlaylist: number): Promise<Playlist> {
        return await this.playlistRepository.findOne({
            where: { id: idPlaylist },
            relations: ['podcasts'],
        });
    }

    async getListPlaylist(username: string, idPodcast: number): Promise<User> {
        // return await this.playlistRepository.find({ where: {id: idUser}, relations: ["playlists"] });
        let dataUser = await this.userRepository.findOne({
            where: { username: username },
            relations: ['playlists'],
        });
        const getDetailPodcast = await this.podcastRepository.findOne({
            where: { id: idPodcast },
            relations: ['playlists'],
        });

        dataUser.playlists = dataUser.playlists.map(dataPlaylist => {
            if (Array.isArray(getDetailPodcast.playlists)) {
                dataPlaylist['inPlaylist'] =
                    getDetailPodcast.playlists.filter(
                        dataPodcast => dataPodcast.id == dataPlaylist.id,
                    ).length > 0;
            } else {
                dataPlaylist['inPlaylist'] = false;
            }
            return dataPlaylist;
        });

        return dataUser;
    }

    async searchPlaylist(keyword: string): Promise<Playlist[]> {
        return await this.playlistRepository.find({
            relations: ['podcasts'],
            where: { title: Like(`%${keyword}%`) },
        });
    }

    async create(idUser: number, playlist: Playlist): Promise<any> {
        playlist.title =
            playlist.title.length === 0 ? 'Untitled' : playlist.title;
        const isAvailable = await this.checkPlaylistExistByTitle(
            playlist.title,
        );
        if (isAvailable) {
            throw new HttpException('Title is exist', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findOne({
            where: { id: idUser },
            relations: ['playlists'],
        });

        const newPlaylist = await this.playlistRepository.save(playlist);
        newPlaylist.user = user;

        if (user.playlists.length > 0) {
            user.playlists.push(newPlaylist);
        } else {
            user.playlists = [newPlaylist];
        }

        await this.userRepository.save(user);
        // console.log(newPlaylist);
        return newPlaylist;
    }

    async update(
        idUser: number,
        idPlaylist: number,
        playlist: Playlist,
    ): Promise<UpdateResult> {
        if (playlist.title.length === 0) {
            throw new HttpException(
                'Title Playlist is empty',
                HttpStatus.BAD_REQUEST,
            );
        }

        const isNotExist = await this.checkPlaylistExist(idPlaylist);
        if (isNotExist) {
            //  console.log('throw new HttpException');
            throw new HttpException(
                "Playlist doesn't exist",
                HttpStatus.BAD_REQUEST,
            );
        }

        const isEditable = await this.checkPrivilege(idUser, idPlaylist);
        if (!isEditable) {
            throw new HttpException(
                "You don't have previllage to edit this playlist",
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.playlistRepository.update(idPlaylist, playlist);
    }

    async delete(idUser: number, idPlaylist: number): Promise<DeleteResult> {
        const isNotExist = await this.checkPlaylistExist(idPlaylist);
        if (isNotExist) {
            throw new HttpException(
                "Playlist doesn't exist",
                HttpStatus.BAD_REQUEST,
            );
        }

        const isEditable = await this.checkPrivilege(idUser, idPlaylist);
        if (!isEditable) {
            throw new HttpException(
                "You don't have previllage to edit this playlist",
                HttpStatus.BAD_REQUEST,
            );
        }

        return await this.playlistRepository.delete(idPlaylist);
    }

    async addPlayList(idPlaylist: number, idPodcast: number): Promise<any> {
        const dataPlaylist = await this.playlistRepository.findOne({
            where: { id: idPlaylist },
            relations: ['podcasts'],
        });
        // console.log(dataPlaylist, !dataPlaylist, !!dataPlaylist, !!!dataPlaylist, idPlaylist);
        const isNotExist = await this.checkPlaylistExist(idPlaylist);
        // console.log(isNotExist);
        if (isNotExist) {
            // console.log("throw new HttpException");
            throw new HttpException(
                "Playlist doesn't exist",
                HttpStatus.BAD_REQUEST,
            );
        }
        const dataPodcast = await this.podcastRepository.findOne({
            where: { id: idPodcast },
        });
        if (!dataPodcast) {
            throw new HttpException(
                "Podcast doesn't exist",
                HttpStatus.BAD_REQUEST,
            );
        }

        if (dataPlaylist.podcasts.length > 0) {
            if (
                dataPlaylist.podcasts.find(podcast => podcast.id === idPodcast)
            ) {
                return { dataPlaylist };
            }
            dataPlaylist.podcasts.push(dataPodcast);
        } else {
            dataPlaylist.podcasts = [dataPodcast];
        }
        await this.playlistRepository.save(dataPlaylist);
        return dataPlaylist;
    }

    async removePlaylist(idPlaylist: number, idPodcast: number): Promise<any> {
        let playlist = await this.playlistRepository.findOne({
            where: { id: idPlaylist },
            relations: ['podcasts'],
        });
        const isNotExist = await this.checkPlaylistExist(idPlaylist);
        if (isNotExist) {
            throw new HttpException(
                "Playlist doesn't exist",
                HttpStatus.BAD_REQUEST,
            );
        }
        const podcast = await this.podcastRepository.findOne({
            where: { id: idPodcast },
            relations: ['playlists'],
        });
        const isPodcastNotExist = await this.checkPodcastExist(idPodcast);
        if (isPodcastNotExist) {
            throw new HttpException(
                "Podcast doesn't exist",
                HttpStatus.BAD_REQUEST,
            );
        }

        const deleteIndex = playlist.podcasts.findIndex(
            podcastInPlaylist => podcastInPlaylist.id === podcast.id,
        );

        if (deleteIndex >= 0) {
            playlist.podcasts.splice(deleteIndex, 1);
            playlist = await this.playlistRepository.save(playlist);
        }

        return playlist;
    }
}
