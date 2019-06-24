import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, UpdateResult, Like } from "typeorm";
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

    async findDetail(idPodcast: number): Promise<Podcast> {
        const dataPodcast = await this.podcastRepository.findOne({ where: {id: idPodcast}, relations: ["user", "playlists"]  });
        // console.log("dataPodcast", idPodcast, dataPodcast);
        return dataPodcast;
    }

    async searchPodcast(titlePodcast: string): Promise<Podcast[]> {
        return await this.podcastRepository.find({ title: Like(`%${titlePodcast}%`) });
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

        var youtubeLinkFormat = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;

        if(!youtubeLinkFormat.test(podcast.youtubeLink)){
            throw new HttpException('Link Youtube have invalid format', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userRepository.findOne(id);

        let entryPodcast = new Podcast();
        entryPodcast.title = (podcast.title.length == 0)? "Untitled" : podcast.title;
        entryPodcast.duration = podcast.duration;
        entryPodcast.description = podcast.description;
        entryPodcast.youtubeLink = podcast.youtubeLink;
        entryPodcast.user = user;

        const newPodcast = await this.podcastRepository.save(entryPodcast);

        // if(Array.isArray(user.podcasts)){
        //     user.podcasts.push(entryPodcast)
        // }else{
        //     user.podcasts = [entryPodcast];
        // }

        // await this.userRepository.save(user);

        return newPodcast;


    }

    async update(id, idPodcast, podcast: Podcast): Promise<UpdateResult> {


        const dataPodcast  = await this.podcastRepository.findOne(idPodcast);
        if(!!dataPodcast == false){
            // console.log("throw new HttpException");
            throw new HttpException('Podcast doesn\'t exist', HttpStatus.BAD_REQUEST);
        }

        return await this.podcastRepository.update(idPodcast, podcast);
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
