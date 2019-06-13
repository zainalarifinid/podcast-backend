import { ProfileService } from "../ProfileService";
import { FollowRepository } from "../../repositories/FollowRepositories";
import { UserRepository } from "../../../User/repositories";
import { HttpException } from "@nestjs/common";
import { User } from "../../../User/entities/User";

jest.mock('../../repositories/')
jest.mock('../../../user/repositories/UserRepository')

describe('ProfileService', () => {

    let profileService: ProfileService;
    let followRepositoryMock: jest.Mocked<FollowRepository>;
    let userRepositoryMock: jest.Mocked<UserRepository>;

    beforeEach( () => {
        followRepositoryMock = new FollowRepository() as jest.Mocked<FollowRepository>;
        userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;

        profileService = new ProfileService( followRepositoryMock, userRepositoryMock );

    } );

    describe( 'getProfile', () => {

        let usernameFollower: string = "zainal1";
        let usernameFollowing: string = "zainal2";

        const exampleDataFollower = new User();
        exampleDataFollower.id = 1;
        exampleDataFollower.email = "zainal1@online-pajak.com";
        exampleDataFollower.username = "zainal1";

        const exampleDataFollowing = new User();
        exampleDataFollower.id = 2;
        exampleDataFollowing.email = "zainal2@online-pajak.com";
        exampleDataFollowing.username = "zainal2";

        it('Should reject with HttpException if "userFollowing" given not exist User ', async(done) => {

            userRepositoryMock.findOne.mockResolvedValueOnce(exampleDataFollower as any);
            userRepositoryMock.findOne.mockResolvedValueOnce(null);

            try{

                await profileService.getProfile(usernameFollower, usernameFollowing);

            } catch(err){
                // console.log(err);
                expect(userRepositoryMock.findOne).toHaveBeenCalledWith({username: "zainal1"});
                expect(userRepositoryMock.findOne).toHaveBeenCalledWith({username: "zainal2"});

                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe('account not found');
                // console.log(err);
                done();

            }
        });
    } );

    describe( 'follow', () => {

        let usernameFollower: string = "zainal1";
        let usernameFollowing: string = "zainal2";

        const exampleDataFollower = new User();
        exampleDataFollower.id = 1;
        exampleDataFollower.email = "zainal1@online-pajak.com";
        exampleDataFollower.username = "zainal1";

        const exampleDataFollowing = new User();
        exampleDataFollower.id = 2;
        exampleDataFollowing.email = "zainal2@online-pajak.com";
        exampleDataFollowing.username = "zainal2";

        it('Should reject with HttpException if "userFollowing" given not exist User ', async(done) => {

            userRepositoryMock.findOne.mockResolvedValueOnce(exampleDataFollower as any);
            userRepositoryMock.findOne.mockResolvedValueOnce(null);

            try{

                await profileService.follow(usernameFollower, usernameFollowing);

            } catch(err){
                // console.log(err);
                expect(userRepositoryMock.findOne).toHaveBeenCalledWith({username: "zainal1"});
                expect(userRepositoryMock.findOne).toHaveBeenCalledWith({username: "zainal2"});

                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe('account not found');
                // console.log(err);
                done();

            }
        });

    } );

    describe( 'unfollow', () => {

        let usernameFollower: string = "zainal1";
        let usernameFollowing: string = "zainal2";

        const exampleDataFollower = new User();
        exampleDataFollower.id = 1;
        exampleDataFollower.email = "zainal1@online-pajak.com";
        exampleDataFollower.username = "zainal1";

        const exampleDataFollowing = new User();
        exampleDataFollower.id = 2;
        exampleDataFollowing.email = "zainal2@online-pajak.com";
        exampleDataFollowing.username = "zainal2";

        it('Should reject with HttpException if "userUnfollowing" given not exist User ', async(done) => {

            userRepositoryMock.findOne.mockResolvedValueOnce(exampleDataFollower as any);
            userRepositoryMock.findOne.mockResolvedValueOnce(null);

            try{

                await profileService.unfollow(usernameFollower, usernameFollowing);

            } catch(err){
                // console.log(err);
                expect(userRepositoryMock.findOne).toHaveBeenCalledWith({username: "zainal1"});
                expect(userRepositoryMock.findOne).toHaveBeenCalledWith({username: "zainal2"});

                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe('account not found');
                // console.log(err);
                done();

            }
        });

    } );

})
