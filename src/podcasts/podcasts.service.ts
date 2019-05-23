import { Injectable, Inject } from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { Podcast } from "./podcast.entity";

@Injectable()
export class PodcastsService {

    constructor(
        @Inject('PODCAST_REPOSITORY')
        private readonly podcastRepository: Repository<Podcast>,
    ) {}

    async findAll(): Promise<Podcast[]> {
        return await this.podcastRepository.find();
    }

    async create(podcast: Podcast): Promise<Podcast> {
        return await this.podcastRepository.save(podcast);
    }

    async update(id, podcast: Podcast): Promise<UpdateResult> {
        return await this.podcastRepository.update(id, podcast);
    }

    async delete( id ): Promise<DeleteResult> {
        return await this.podcastRepository.delete(parseInt(id));
    }

}
