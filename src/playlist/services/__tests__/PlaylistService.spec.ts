import { PlaylistService } from "../PlaylistService";
import { PlaylistRepository } from "../../repositories";
import { PodcastRepository } from "../../../podcast/repositories";
import { Playlist } from "../../entities/Playlist";
import { User } from "../../../user/entities/User";
import { UserRepository } from "../../../user/repositories";
import { Podcast } from "../../../podcast/entities/Podcast";
import { HttpException } from "@nestjs/common";

jest.mock('../../repositories/PlaylistRepository')
jest.mock('../../../podcast/repositories/PodcastRepository')
jest.mock('../../../user/repositories/UserRepository')

describe('PlaylistService', () => {

    let playlistService: PlaylistService;
    let playlistRepositoryMock: jest.Mocked<PlaylistRepository>;
    let podcastRepositoryMock: jest.Mocked<PodcastRepository>;
    let userRepositoryMock: jest.Mocked<UserRepository>;

    beforeEach( ()=>{
        playlistRepositoryMock = new PlaylistRepository() as jest.Mocked<PlaylistRepository>;
        podcastRepositoryMock = new PodcastRepository() as jest.Mocked<PodcastRepository>;
        userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
        playlistService = new PlaylistService(playlistRepositoryMock, podcastRepositoryMock, userRepositoryMock);

    } );

    describe('create', () => {

        const exampleDataPlaylist = new Playlist();
        exampleDataPlaylist.title = "Morning Vibes";

        let idUser: number = 1;
        const exampleDataUser = new User();
        exampleDataUser.id = 1;
        exampleDataUser.username = "zainal1";
        exampleDataUser.email = "zainal1@online-pajak.com";
        exampleDataUser.playlists = [ exampleDataPlaylist ];

        const exampleDataPodcast = new Podcast();
        exampleDataPodcast.title = "Learn Japanese Pod Podcast 01";
        exampleDataPodcast.description = "Easy learning Japanese.";
        exampleDataPodcast.duration = "23m52s";
        exampleDataPodcast.youtubeLink = "https://www.youtube.com/watch?v=siBMCOm83ko";

        exampleDataPlaylist.podcasts = [ exampleDataPodcast ];

        it('Should result untitled in title if "title" given empty string', async(done) => {
            
            exampleDataPlaylist.title = "";

            playlistRepositoryMock.save.mockResolvedValueOnce( exampleDataPlaylist as any );
            playlistRepositoryMock.findOne.mockResolvedValueOnce( null );
            userRepositoryMock.findOne.mockResolvedValueOnce( exampleDataUser as any );

            try{
                // playlistRepositoryMock.findOne.mockResolvedValueOnce( null );
                await playlistService.create(idUser, exampleDataPlaylist);
                exampleDataPlaylist.title = "Untitled";
                done();               

            }catch(err){
                expect(playlistRepositoryMock.save).toHaveBeenCalledWith(exampleDataPlaylist);
                done("should have success to save podcast ");
            }

        });

        it('Should result HttpException if "title" given exist title', async(done) => {
            
            exampleDataPlaylist.title = "Morning Vibes";

            playlistRepositoryMock.findOne.mockResolvedValueOnce( exampleDataPlaylist as any );
            // playlistRepositoryMock.save.mockResolvedValueOnce( exampleDataPlaylist as any );
            // userRepositoryMock.findOne.mockResolvedValueOnce( exampleDataUser as any );

            try{
                
                await playlistService.create(idUser, exampleDataPlaylist);
                done("should have thrown HttpException");

            }catch(err){
                expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith({title:exampleDataPlaylist.title});
                // expect(playlistRepositoryMock.save).toHaveBeenCalledWith(exampleDataPlaylist);
                expect(err.message).toBe("Title is exist");
                done();
            }

        });

    });

    describe('Add Playlist', () => {

        const exampleDataPlaylist = new Playlist();
        exampleDataPlaylist.title = "Morning Vibes";

        let idUser: number = 1;
        const exampleDataUser = new User();
        exampleDataUser.id = 1;
        exampleDataUser.username = "zainal1";
        exampleDataUser.email = "zainal1@online-pajak.com";
        exampleDataUser.playlists = [ exampleDataPlaylist ];

        const exampleDataPodcast = new Podcast();
        exampleDataPodcast.title = "Learn Japanese Pod Podcast 01";
        exampleDataPodcast.description = "Easy learning Japanese.";
        exampleDataPodcast.duration = "23m52s";
        exampleDataPodcast.youtubeLink = "https://www.youtube.com/watch?v=siBMCOm83ko";

        exampleDataPlaylist.podcasts = [ exampleDataPodcast ];

        it('Should result HttpException if playlist given not exist', async(done) => {
            
            playlistRepositoryMock.findOne.mockResolvedValueOnce(null);
            playlistRepositoryMock.findOne.mockResolvedValueOnce(null);

            let idPlaylist: number = 9999;
            let idPodcast: number = 999;

            try{
                await playlistService.addPlayList(idPlaylist, idPodcast);
                done("should have thrown HttpException");
            }catch(err){
                // console.log(err);
                expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith(idPlaylist);
                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe("Playlist doesn't exist");
                done();
            }

        })

    });

    describe('Remove Playlist', () => {

        const exampleDataPlaylist = new Playlist();
        exampleDataPlaylist.title = "Morning Vibes";

        let idUser: number = 1;
        const exampleDataUser = new User();
        exampleDataUser.id = 1;
        exampleDataUser.username = "zainal1";
        exampleDataUser.email = "zainal1@online-pajak.com";
        exampleDataUser.playlists = [ exampleDataPlaylist ];

        const exampleDataPodcast = new Podcast();
        exampleDataPodcast.title = "Learn Japanese Pod Podcast 01";
        exampleDataPodcast.description = "Easy learning Japanese.";
        exampleDataPodcast.duration = "23m52s";
        exampleDataPodcast.youtubeLink = "https://www.youtube.com/watch?v=siBMCOm83ko";

        exampleDataPlaylist.podcasts = [ exampleDataPodcast ];

        it('Should result HttpException if playlist given not exist', async(done) => {
            
            playlistRepositoryMock.findOne.mockResolvedValueOnce(null);

            let idPlaylist: number = 9999;
            let idPodcast: number = 999;

            try{
                await playlistService.addPlayList(idPlaylist, idPodcast);
                done("should have thrown HttpException");
            }catch(err){
                // console.log(err);
                expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith(idPlaylist);
                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe("Playlist doesn't exist");
                done();
            }

        });
        
        it('Should result HttpException if podcast given not exist', async(done) => {
            
            playlistRepositoryMock.findOne.mockResolvedValueOnce(exampleDataPlaylist as any);
            podcastRepositoryMock.findOne.mockResolvedValueOnce(null);

            let idPlaylist: number = 9999;
            let idPodcast: number = 999;

            try{
                await playlistService.removePlaylist(idPlaylist, idPodcast);
                done("should have thrown HttpException");
            }catch(err){
                // console.log(err);
                expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith(idPlaylist);
                expect(podcastRepositoryMock.findOne).toHaveBeenCalledWith(idPodcast);
                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe("Podcast doesn't exist");
                done();
            }

        });

    });

});
