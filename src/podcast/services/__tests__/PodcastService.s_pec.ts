import { PodcastsService } from "../PodcastService";
import { Repository } from "typeorm";
import { Podcast } from "../../entities/Podcast";
import { User } from "../../../user/entities/User";
import { HttpException } from "@nestjs/common";

describe('PodcastService', () => {
    let podcastService: PodcastsService;
    let podcastRepository: Repository<Podcast>;
    let userRepository: Repository<User>;

    beforeEach(()=>{
        podcastRepository = new Repository<Podcast>();
        podcastService = new PodcastsService(podcastRepository, userRepository);
    });

    describe('create', () => {
        it('Should reject with HttpException if "email" given empty string ', async(done) => {

            const exampleDataPodcast = new Podcast();
            exampleDataPodcast.title = "";
            exampleDataPodcast.description = "zainal3";
            exampleDataPodcast.duration = "zainal3";
            exampleDataPodcast.youtubeLink = "zainal3";

            let idUser: number = 1;

            try{

                await podcastService.create(idUser, exampleDataPodcast);
                done("should have thrown HttpException");

            } catch(err){

                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe('Email is required');
                // console.log(err);
                done();

            }
        });
    })

})
