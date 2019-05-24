import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { Podcast } from "../entities/Podcast";
import { User } from "../../user/entities/User";

@Injectable()
export class PodcastsService {

    constructor(
        @Inject('PODCAST_REPOSITORY')
        private readonly podcastRepository: Repository<Podcast>,
        @Inject('USER_REPOSITORY')
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<Podcast[]> {
        return await this.podcastRepository.find();
    }

    async create(id: number, podcast: Podcast): Promise<Podcast> {
        
        let entryPodcast = new Podcast();
        entryPodcast.title = podcast.title;
        entryPodcast.duration = podcast.duration;
        entryPodcast.description = podcast.description;

        const newPodcast = await this.podcastRepository.save(entryPodcast);
        const user = await this.userRepository.findOne(id);

        if(Array.isArray(user.podcasts)){
            user.podcasts.push(entryPodcast)
        }else{
            user.podcasts = [entryPodcast];
        }

        await this.userRepository.save(user);

        return newPodcast;


    }

    async update(id, podcast: Podcast): Promise<UpdateResult> {
        return await this.podcastRepository.update(id, podcast);
    }

    async delete( id ): Promise<DeleteResult> {
        return await this.podcastRepository.delete(parseInt(id));
    }

}
