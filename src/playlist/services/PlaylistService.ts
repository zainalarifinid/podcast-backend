import { Injectable, Inject } from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { Playlist } from "../entities/Playlist";

@Injectable()
export class PlaylistService{

    constructor(
        @Inject('PLAYLIST_REPOSITORY')
        private readonly playlistRepository: Repository<Playlist>,
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

}
