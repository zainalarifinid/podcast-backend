import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, UpdateResult } from "typeorm";
import { Podcast } from "../entities/Podcast";
import { User } from "../../User/entities/User";
import { PodcastRepository } from '../repositories';
import { UserRepository } from '../../User/repositories';

@Injectable()
export class PodcastService {

    constructor(
        @InjectRepository(Podcast)
        private readonly podcastRepository: PodcastRepository,
        @InjectRepository(User)
        private readonly userRepository: UserRepository,
    ) {}

    async findAll(): Promise<Podcast[]> {
        return await this.podcastRepository.find();
    }

    async create(id: number, podcast: Podcast): Promise<Podcast> {
        
        if(podcast.duration.length == 0){
            throw new HttpException('Duration is required', HttpStatus.BAD_REQUEST);                        
        }
        var durationFormat = /[0-9]{2}m[0-9]{2}s/;
        if(!durationFormat.test(podcast.duration)){
            throw new HttpException("Duration format is invalid", HttpStatus.BAD_REQUEST);
        }

        if(podcast.youtubeLink.length == 0){
            throw new HttpException('Link Youtube is required', HttpStatus.BAD_REQUEST);
        }

        var youtubeLinkFormat = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

        if(!youtubeLinkFormat.test(podcast.youtubeLink)){
            throw new HttpException('Link Youtube have invalid format', HttpStatus.BAD_REQUEST);
        }

        let entryPodcast = new Podcast();
        entryPodcast.title = (podcast.title.length == 0)? "Untitled" : podcast.title;
        entryPodcast.duration = podcast.duration;
        entryPodcast.description = podcast.description;
        entryPodcast.youtubeLink = podcast.youtubeLink;

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

        const dataPodcast  = await this.podcastRepository.findOne(id);
        if(!!dataPodcast == false){
            // console.log("throw new HttpException");
            throw new HttpException('Podcast doesn\'t exist', HttpStatus.BAD_REQUEST);
        }

        return await this.podcastRepository.update(id, podcast);
    }

    async delete( id ): Promise<DeleteResult> {

        const dataPodcast  = await this.podcastRepository.findOne(id);
        if(!!dataPodcast == false){
            // console.log("throw new HttpException");
            throw new HttpException('Podcast doesn\'t exist', HttpStatus.BAD_REQUEST);
        }

        return await this.podcastRepository.delete(parseInt(id));
    }

}
