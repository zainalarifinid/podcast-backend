import { PodcastService } from "../PodcastService";
import { Podcast } from "../../entities/Podcast";
import { User } from "../../../user/entities/User";
import { PodcastRepository } from "../../repositories";
import { UserRepository } from "../../../user/repositories";
import { HttpException } from "@nestjs/common";

jest.mock('../../repositories/PodcastRepository')
jest.mock('../../../user/repositories/UserRepository')
describe('PodcastService', () => {
    let podcastService: PodcastService;
    let podcastRepositoryMock: jest.Mocked<PodcastRepository>;
    let userRepositoryMock: jest.Mocked<UserRepository>;

    beforeEach(()=>{
        podcastRepositoryMock = new PodcastRepository() as jest.Mocked<PodcastRepository>;
        userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
        podcastService = new PodcastService(podcastRepositoryMock, userRepositoryMock);
    });

    describe('create', () => {

        const exampleDataPodcast = new Podcast();
        exampleDataPodcast.title = "Learn Japanese Pod Podcast 01";
        exampleDataPodcast.description = "Easy learning Japanese.";
        exampleDataPodcast.duration = "23m52s";
        exampleDataPodcast.youtubeLink = "https://www.youtube.com/watch?v=siBMCOm83ko";
        let idUser: number = 1;

        const exampleDataUser = new User();
        exampleDataUser.email = "zainal1@online-pajak.com";
        exampleDataUser.username = "zainal1";
        exampleDataUser.podcasts = [ exampleDataPodcast ];

        it('Should result untitled in title if "title" given empty string ', async(done) => {

            exampleDataPodcast.title = "";
            podcastRepositoryMock.save.mockResolvedValueOnce( exampleDataPodcast as any );
            userRepositoryMock.findOne.mockResolvedValueOnce( exampleDataUser as any );

            try{

                await podcastService.create(idUser, exampleDataPodcast);
                exampleDataPodcast.title = "Untitled";
                expect(podcastRepositoryMock.save).toHaveBeenCalledWith(exampleDataPodcast);
                done();

            } catch(err){
                expect(podcastRepositoryMock.save).toHaveBeenCalledWith(exampleDataPodcast);
                done("should have success to save podcast ");

            }
        });

        it('Should reject with HttpException if duration given empty string', async(done)=>{
            
            exampleDataPodcast.title = "Learn Japanese Pod Podcast 01";            
            exampleDataPodcast.duration = "";
            podcastRepositoryMock.save.mockResolvedValueOnce( exampleDataPodcast as any );
            userRepositoryMock.findOne.mockResolvedValueOnce( exampleDataUser as any );

            try{
                await podcastService.create(idUser, exampleDataPodcast);
                done("should have thrown HttpException");
            } catch(err){
                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe("Duration is required");
                done();
            }

        });

        it('Should reject with HttpException if duration given invalid format string', async(done)=>{
            
            exampleDataPodcast.duration = "32s10m";
            podcastRepositoryMock.save.mockResolvedValueOnce( exampleDataPodcast as any );
            userRepositoryMock.findOne.mockResolvedValueOnce( exampleDataUser as any );

            try{
                await podcastService.create(idUser, exampleDataPodcast);
                done("should have thrown HttpException");
            } catch(err){
                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe("Duration format is invalid");
                done();
            }

        });

        it('Should reject with HttpException if youtubeLink given empty string', async(done)=>{
            
            exampleDataPodcast.duration = "32m10s";
            exampleDataPodcast.youtubeLink = "";
            podcastRepositoryMock.save.mockResolvedValueOnce( exampleDataPodcast as any );
            userRepositoryMock.findOne.mockResolvedValueOnce( exampleDataUser as any );

            try{
                await podcastService.create(idUser, exampleDataPodcast);
                done("should have thrown HttpException");
            } catch(err){
                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe("Link Youtube is required");
                done();
            }

        });

        it('Should reject with HttpException if youtubeLink given invalid format', async(done)=>{
            
            exampleDataPodcast.youtubeLink = "htttp://youtubeee/";
            podcastRepositoryMock.save.mockResolvedValueOnce( exampleDataPodcast as any );
            userRepositoryMock.findOne.mockResolvedValueOnce( exampleDataUser as any );

            try{
                await podcastService.create(idUser, exampleDataPodcast);
                done("should have thrown HttpException");
            } catch(err){
                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe("Link Youtube have invalid format");
                done();
            }

        });

    });

})
