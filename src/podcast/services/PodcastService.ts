import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { PodcastEntity } from "../entities/Podcast";
import { User } from "../../user/entities/User";

@Injectable()
export class PodcastsService {

    constructor(
        @Inject('PODCAST_REPOSITORY')
        private readonly podcastRepository: Repository<PodcastEntity>,
    ) {}

    async findAll(): Promise<PodcastEntity[]> {
        return await this.podcastRepository.find();
    }

    async create(id: number, podcast: PodcastEntity): Promise<PodcastEntity> {
        
        let entryPodcast = new PodcastEntity();
        entryPodcast.title = podcast.title;
        entryPodcast.duration = podcast.duration;
        entryPodcast.description = podcast.description;

        const newPodcast = await this.podcastRepository.save(entryPodcast);
        // const user = await this.userRepository.findOne(id);

        // if(Array.isArray(user.podcasts)){
        //     user.podcasts.push(entryPodcast)
        // }else{
        //     user.podcasts = [entryPodcast];
        // }

        // await this.userRepository.save(user);

        return newPodcast;


    }

    async update(id, podcast: PodcastEntity): Promise<UpdateResult> {
        return await this.podcastRepository.update(id, podcast);
    }

    async delete( id ): Promise<DeleteResult> {
        return await this.podcastRepository.delete(parseInt(id));
    }

}
