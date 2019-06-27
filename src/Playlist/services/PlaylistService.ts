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
    playlist.title = playlist.title.length == 0 ? 'Untitled' : playlist.title;

    const checkTitle = await this.playlistRepository.findOne({
      title: playlist.title,
    });
    if (!!checkTitle) {
      throw new HttpException('Title is exist', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({
      where: { id: idUser },
      relations: ['playlists'],
    });
    const newPlaylist = await this.playlistRepository.save(playlist);
    newPlaylist.user = user;
    // console.log('check user : ', idUser, user);
    if (user.playlists.length > 0) {
      user.playlists.push(newPlaylist);
    } else {
      user.playlists = [newPlaylist];
    }

    await this.userRepository.save(user);
    // console.log(newPlaylist);
    return { newPlaylist };
  }

  async update(
    idUser: number,
    idPlaylist: number,
    playlist: Playlist,
  ): Promise<UpdateResult> {
    const searchPlaylist = await this.playlistRepository.findOne(idPlaylist);
    //!!playlist mean playlist was empty
    if (!!!searchPlaylist) {
    //   console.log('throw new HttpException');
      throw new HttpException("Playlist doesn't exist", HttpStatus.BAD_REQUEST);
    }

    // const userPlaylist = await this.userRepository.findOne({ where: { id: idUser }, relations: ["playlists"] });

    // console.log(idUser, idPlaylist, playlist, userPlaylist);

    // if(userPlaylist.playlists && userPlaylist.playlists.length > 0){
    //     const deleteIndex = userPlaylist.playlists.findIndex(_playlist => _playlist.id == idPlaylist);

    //     if (deleteIndex >= 0) {
    //         userPlaylist.playlists.splice(deleteIndex, 1);
    //         await this.userRepository.save(userPlaylist);
    //     }
    // }

    return await this.playlistRepository.update(idPlaylist, playlist);
  }

  async delete(id): Promise<DeleteResult> {
    const searchPlaylist = await this.playlistRepository.findOne(id);
    //!!playlist mean playlist was empty
    if (!!!searchPlaylist) {
    //   console.log('throw new HttpException');
      throw new HttpException("Playlist doesn't exist", HttpStatus.BAD_REQUEST);
    }

    return await this.playlistRepository.delete(parseInt(id));
  }

  async addPlayList(idPlaylist: number, idPodcast: number): Promise<any> {
    const dataPlaylist = await this.playlistRepository.findOne({
      where: { id: idPlaylist },
      relations: ['podcasts'],
    });
    // console.log(dataPlaylist);

    if (!!!dataPlaylist) {
      // console.log("throw new HttpException");
      throw new HttpException("Playlist doesn't exist", HttpStatus.BAD_REQUEST);
    }
    const dataPodcast = await this.podcastRepository.findOne({
      where: { id: idPodcast },
    });
    if (!dataPodcast) {
      throw new HttpException("Podcast doesn't exist", HttpStatus.BAD_REQUEST);
    }

    if (dataPlaylist.podcasts.length > 0) {
      if (dataPlaylist.podcasts.find(podcast => podcast.id === idPodcast)) {
        return { dataPlaylist };
      }
      dataPlaylist.podcasts.push(dataPodcast);
    } else {
      dataPlaylist.podcasts = [dataPodcast];
    }
    await this.playlistRepository.save(dataPlaylist);
    return { dataPlaylist };
  }

  async removePlaylist(idPlaylist: number, idPodcast: number): Promise<any> {
    let playlist = await this.playlistRepository.findOne({
      where: { id: idPlaylist },
      relations: ['podcasts'],
    });
    if (!!!playlist) {
      // console.log("throw new HttpException");
      throw new HttpException("Playlist doesn't exist", HttpStatus.BAD_REQUEST);
    }
    const podcast = await this.podcastRepository.findOne({
      where: { id: idPodcast },
      relations: ['playlists'],
    });
    if (!!podcast == false) {
      // console.log("throw new HttpException");
      throw new HttpException("Podcast doesn't exist", HttpStatus.BAD_REQUEST);
    }

    const deleteIndex = playlist.podcasts.findIndex(
      podcastInPlaylist => podcastInPlaylist.id === podcast.id,
    );

    if (deleteIndex >= 0) {
      playlist.podcasts.splice(deleteIndex, 1);
      playlist = await this.playlistRepository.save(playlist);
    }

    return { playlist };
  }
}
