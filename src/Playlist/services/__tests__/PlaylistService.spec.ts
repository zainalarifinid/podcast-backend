import { PlaylistService } from '../PlaylistService';
import { PlaylistRepository } from '../../repositories';
import { PodcastRepository } from '../../../Podcast/repositories';
import { Playlist } from '../../entities/Playlist';
import { User } from '../../../User/entities/User';
import { UserRepository } from '../../../User/repositories';
import { Podcast } from '../../../Podcast/entities/Podcast';
import { HttpException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';

jest.mock('../../repositories/PlaylistRepository');
jest.mock('../../../podcast/repositories/PodcastRepository');
jest.mock('../../../user/repositories/UserRepository');

describe('PlaylistService', () => {
    let playlistService: PlaylistService;
    let playlistRepositoryMock: jest.Mocked<PlaylistRepository>;
    let podcastRepositoryMock: jest.Mocked<PodcastRepository>;
    let userRepositoryMock: jest.Mocked<UserRepository>;

    beforeEach(() => {
        playlistRepositoryMock = new PlaylistRepository() as jest.Mocked<
            PlaylistRepository
        >;
        podcastRepositoryMock = new PodcastRepository() as jest.Mocked<
            PodcastRepository
        >;
        userRepositoryMock = new UserRepository() as jest.Mocked<
            UserRepository
        >;
        playlistService = new PlaylistService(
            playlistRepositoryMock,
            podcastRepositoryMock,
            userRepositoryMock,
        );
    });

    describe('create some playlist', () => {
        const exampleDataPlaylist = new Playlist();
        exampleDataPlaylist.title = 'Morning Vibes';

        const idUser: number = 1;
        const exampleDataUser = new User();
        exampleDataUser.id = 1;
        exampleDataUser.username = 'zainal1';
        exampleDataUser.email = 'zainal1@online-pajak.com';
        exampleDataUser.playlists = [exampleDataPlaylist];

        it('Should result untitled in title if "title" given empty string', async done => {
            exampleDataPlaylist.title = '';

            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementation(() => null);

            userRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => exampleDataUser);

            playlistRepositoryMock.save.mockResolvedValueOnce(
                exampleDataPlaylist as any,
            );

            userRepositoryMock.save = jest
                .fn()
                .mockImplementationOnce(() => exampleDataUser);

            try {
                await playlistService.create(idUser, exampleDataPlaylist);
                exampleDataPlaylist.title = 'Untitled';
                done();
            } catch (err) {
                expect(playlistRepositoryMock.save).toHaveBeenCalledWith(
                    exampleDataPlaylist,
                );
                done('should have success to save podcast ');
            }
        });

        it('Should result HttpException if "title" given exist title', async done => {
            exampleDataPlaylist.title = 'Morning Vibes';

            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => exampleDataPlaylist);

            try {
                await playlistService.create(idUser, exampleDataPlaylist);
                done('should have thrown HttpException');
            } catch (err) {
                expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith({
                    title: exampleDataPlaylist.title,
                });
                // expect(playlistRepositoryMock.save).toHaveBeenCalledWith(exampleDataPlaylist);
                expect(err.message).toBe('Title is exist');
                done();
            }
        });

        it('Should result object Playlist if all requirement filled', async done => {
            exampleDataPlaylist.title = 'Morning Vibes New';
            exampleDataUser.playlists = [exampleDataPlaylist];

            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => null);
            userRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => exampleDataUser);
            playlistRepositoryMock.save = jest
                .fn()
                .mockImplementationOnce(() => exampleDataPlaylist);
            userRepositoryMock.save = jest
                .fn()
                .mockImplementationOnce(() => exampleDataUser);

            try {
                const result = await playlistService.create(
                    idUser,
                    exampleDataPlaylist,
                );
                expect(playlistRepositoryMock.save).toBeCalledWith(
                    exampleDataPlaylist,
                );
                expect(result.title).toBe('Morning Vibes New');
                done();
            } catch (err) {
                done('should have success process');
            }
        });
    });

    describe('update some playlist', () => {
        let idPlaylist: number = 1;
        const exampleDataPlaylist = new Playlist();
        exampleDataPlaylist.id = 1;
        exampleDataPlaylist.title = '';

        const idUser: number = 1;
        const exampleDataUser = new User();
        exampleDataUser.id = 1;
        exampleDataUser.username = 'zainal1';
        exampleDataUser.email = 'zainal1@online-pajak.com';
        exampleDataUser.playlists = [exampleDataPlaylist];

        it('Should result HttpException if playlist given empty title', async done => {
            try {
                await playlistService.update(
                    idUser,
                    idPlaylist,
                    exampleDataPlaylist,
                );
                done('should have thrown HttpException');
            } catch (err) {
                expect(err.message).toBe('Title Playlist is empty');
                done();
            }
        });

        it("Should result HttpException if playlist given doesn't exist", async done => {
            exampleDataPlaylist.title = 'Morning Vibes';

            idPlaylist = 2;

            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => null);

            try {
                await playlistService.update(
                    idUser,
                    idPlaylist,
                    exampleDataPlaylist,
                );
                done('should have thrown HttpException');
            } catch (err) {
                expect(err.message).toBe("Playlist doesn't exist");
                done();
            }
        });

        it("Should result HttpException if user access other's playlist", async done => {
            exampleDataPlaylist.id = 2;
            exampleDataPlaylist.title = 'Morning Vibes';

            idPlaylist = 1;

            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => exampleDataPlaylist);

            userRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => exampleDataUser);

            try {
                await playlistService.update(
                    idUser,
                    idPlaylist,
                    exampleDataPlaylist,
                );
                done('should have thrown HttpException');
            } catch (err) {
                expect(err.message).toBe(
                    "You don't have previllage to edit this playlist",
                );
                done();
            }
        });

        it('should result object playlist if update data playlist is success', async done => {
            exampleDataPlaylist.id = 1;
            exampleDataPlaylist.title = 'Morning Vibes Rename';

            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => exampleDataPlaylist)
                .mockImplementationOnce(() => exampleDataPlaylist);

            userRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => exampleDataUser);

            try {
                await playlistService.update(
                    idUser,
                    idPlaylist,
                    exampleDataPlaylist,
                );
                done();
            } catch (err) {
                done('should have success process');
            }
        });
    });

    describe('delete some playlist', () => {
        let idPlaylist: number = 1;
        const idUser: number = 1;

        const exampleDataPlaylist = new Playlist();
        exampleDataPlaylist.id = 1;
        exampleDataPlaylist.title = 'Morning Vibes';

        const exampleDataUser = new User();
        exampleDataUser.id = 1;
        exampleDataUser.username = 'zainal1';
        exampleDataUser.email = 'zainal1@online-pajak.com';
        exampleDataUser.playlists = [exampleDataPlaylist];

        it('Should result HttpException if playlist is not exist', async done => {
            idPlaylist = 2;
            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => null);
            try {
                await playlistService.delete(idUser, idPlaylist);
                done('should have thrown HttpException');
            } catch (err) {
                expect(err.message).toBe("Playlist doesn't exist");
                done();
            }
        });

        it("Should result HttpException if user doesn't have privilege", async done => {
            exampleDataUser.playlists = [];
            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => exampleDataPlaylist);
            userRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => exampleDataUser);
            try {
                await playlistService.delete(idUser, idPlaylist);
                done('should have thrown HttpException');
            } catch (err) {
                expect(err.message).toBe(
                    "You don't have previllage to edit this playlist",
                );
                done();
            }
        });

        it('Should result object delete result if delete playlist is success', async done => {
            idPlaylist = 1;
            exampleDataUser.playlists = [exampleDataPlaylist];
            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => exampleDataPlaylist);
            userRepositoryMock.findOne = jest
                .fn()
                .mockImplementationOnce(() => exampleDataUser);
            playlistRepositoryMock.delete = jest
                .fn()
                .mockImplementationOnce(() => DeleteResult);
            try {
                await playlistService.delete(idUser, idPlaylist);
                done();
            } catch (err) {
                console.log(err);
                done('should have success process');
            }
        });
    });

    describe('Add Playlist', () => {
        let idPlaylist: number = 1;
        const idUser: number = 1;

        const exampleDataPlaylist = new Playlist();
        exampleDataPlaylist.id = 1;
        exampleDataPlaylist.title = 'Morning Vibes';

        const exampleDataUser = new User();
        exampleDataUser.id = 1;
        exampleDataUser.username = 'zainal1';
        exampleDataUser.email = 'zainal1@online-pajak.com';
        exampleDataUser.playlists = [exampleDataPlaylist];

        let idPodcast: number = 1;
        const exampleDataPodcast = new Podcast();
        exampleDataPodcast.title = 'Learn Japanese Pod Podcast 01';
        exampleDataPodcast.description = 'Easy learning Japanese.';
        exampleDataPodcast.duration = '23m52s';
        exampleDataPodcast.youtubeLink =
            'https://www.youtube.com/watch?v=siBMCOm83ko';

        it('Should result HttpException if playlist given not exist', async done => {
            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementation(() => null);
            idPlaylist = 9999;
            idPodcast = 999;

            try {
                await playlistService.addPlayList(idPlaylist, idPodcast);
                done('should have thrown HttpException');
            } catch (err) {
                // console.log(err);
                // expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith(
                //     idPlaylist,
                // );
                // expect(playlistRepositoryMock.findOne).toHaveReturnedWith(null);
                // expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith(
                //     idPlaylist,
                // );
                // expect(playlistRepositoryMock.findOne).toHaveReturnedWith(null);
                // expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe("Playlist doesn't exist");
                done();
            }
        });

        it('Should result HttpException if podcast given not exist', async done => {
            idPlaylist = 1;
            exampleDataPlaylist.id = idPlaylist;
            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementation(() => exampleDataPlaylist);

            podcastRepositoryMock.findOne = jest
                .fn()
                .mockImplementation(() => null);

            try {
                await playlistService.addPlayList(idPlaylist, idPodcast);
                done('should have thrown HttpException');
            } catch (err) {
                expect(playlistRepositoryMock.findOne).toHaveBeenLastCalledWith(
                    idPlaylist,
                );
                expect(playlistRepositoryMock.findOne).toHaveReturnedWith(
                    exampleDataPlaylist,
                );
                expect(playlistRepositoryMock.findOne).toHaveBeenLastCalledWith(
                    idPlaylist,
                );
                expect(playlistRepositoryMock.findOne).toHaveReturnedWith(
                    exampleDataPlaylist,
                );
                expect(err.message).toBe("Podcast doesn't exist");
                done();
            }
        });

        it('Should result object playlist if playlist success add podcast', async done => {
            // exampleDataPlaylist.podcasts = [exampleDataPodcast];
            playlistRepositoryMock.findOne = jest
                .fn()
                .mockImplementation(() => exampleDataPlaylist);

            podcastRepositoryMock.findOne = jest
                .fn()
                .mockImplementation(() => exampleDataPodcast);

            const resultExcpected = exampleDataPlaylist;
            resultExcpected.podcasts = [exampleDataPodcast];
            podcastRepositoryMock.save = jest
                .fn()
                .mockImplementationOnce(() => resultExcpected);

            try {
                const resultPlaylist = await playlistService.addPlayList(
                    idPlaylist,
                    idPodcast,
                );
                expect(playlistRepositoryMock.findOne).toHaveBeenLastCalledWith(
                  idPlaylist,
                );
                expect(playlistRepositoryMock.findOne).toHaveReturnedWith(
                    exampleDataPlaylist,
                );
                expect(playlistRepositoryMock.findOne).toHaveBeenLastCalledWith(
                    idPlaylist,
                );
                expect(playlistRepositoryMock.findOne).toHaveReturnedWith(
                    exampleDataPlaylist,
                );
                expect(playlistRepositoryMock.save).toHaveBeenLastCalledWith(
                    resultExcpected,
                );
                expect(resultPlaylist).toBe(resultExcpected);
                done();
            } catch (err) {
                // console.log(err);
                done('should have success process');
            }
        });
    });

    //   describe('Remove Playlist', () => {
    //     const exampleDataPlaylist = new Playlist();
    //     exampleDataPlaylist.title = 'Morning Vibes';

    //     const idUser: number = 1;
    //     const exampleDataUser = new User();
    //     exampleDataUser.id = 1;
    //     exampleDataUser.username = 'zainal1';
    //     exampleDataUser.email = 'zainal1@online-pajak.com';
    //     exampleDataUser.playlists = [exampleDataPlaylist];

    //     const exampleDataPodcast = new Podcast();
    //     exampleDataPodcast.title = 'Learn Japanese Pod Podcast 01';
    //     exampleDataPodcast.description = 'Easy learning Japanese.';
    //     exampleDataPodcast.duration = '23m52s';
    //     exampleDataPodcast.youtubeLink =
    //       'https://www.youtube.com/watch?v=siBMCOm83ko';

    //     exampleDataPlaylist.podcasts = [exampleDataPodcast];

    //     it('Should result HttpException if playlist given not exist', async done => {
    //       playlistRepositoryMock.findOne.mockResolvedValueOnce(null);

    //       let idPlaylist: number = 9999;
    //       let idPodcast: number = 999;

    //       try {
    //         await playlistService.addPlayList(idPlaylist, idPodcast);
    //         done('should have thrown HttpException');
    //       } catch (err) {
    //         // console.log(err);
    //         expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith(idPlaylist);
    //         expect(err).toBeInstanceOf(HttpException);
    //         expect(err.message).toBe("Playlist doesn't exist");
    //         done();
    //       }
    //     });

    //     it('Should result HttpException if podcast given not exist', async done => {
    //       playlistRepositoryMock.findOne.mockResolvedValueOnce(
    //         exampleDataPlaylist as any,
    //       );
    //       podcastRepositoryMock.findOne.mockResolvedValueOnce(null);

    //       let idPlaylist: number = 9999;
    //       let idPodcast: number = 999;

    //       try {
    //         await playlistService.removePlaylist(idPlaylist, idPodcast);
    //         done('should have thrown HttpException');
    //       } catch (err) {
    //         // console.log(err);
    //         expect(playlistRepositoryMock.findOne).toHaveBeenCalledWith(idPlaylist);
    //         expect(podcastRepositoryMock.findOne).toHaveBeenCalledWith(idPodcast);
    //         expect(err).toBeInstanceOf(HttpException);
    //         expect(err.message).toBe("Podcast doesn't exist");
    //         done();
    //       }
    //     });
    //   });
});
