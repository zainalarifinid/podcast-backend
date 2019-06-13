import { UserService } from "../UserService";
import { User } from "../../entities/User";
import { Repository } from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UserRepository } from "../../repositories";

jest.mock('../../repositories/UserRepository')
describe('UserService', () => {
    let userService: UserService;
    let userRepositoryMock: jest.Mocked<UserRepository>;

    beforeEach(()=>{
        userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
        userService = new UserService(userRepositoryMock);
    });

    const exampleDataUser = new User();
    exampleDataUser.email = "zainal1@online-pajak.com";
    exampleDataUser.username = "zainal1";

    describe('create', () => {
        it('Should reject with HttpException if "email" given empty string ', async(done) => {

            exampleDataUser.email = "";

            try{

                await userService.create(exampleDataUser);
                done("should have thrown HttpException");

            } catch(err){

                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe('Email is required');
                // console.log(err);
                done();

            }
        });
        it('Should reject with HttpException if "email" given exist email', async(done) => {

            exampleDataUser.email = "zainal1@online-pajak.com";

            userRepositoryMock.findOne.mockResolvedValueOnce(exampleDataUser as any);

            try{

                await userService.create(exampleDataUser);
                done("should have thrown HttpException");


            } catch(err){
                expect(userRepositoryMock.findOne).toHaveBeenCalledWith({email: "zainal1@online-pajak.com"});

                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe('Email is exist');
                // console.log(err);
                done();

            }
        });
        it('Should reject with HttpException if "username" given empty string ', async(done) => {

            exampleDataUser.username = "";

            try{

                await userService.create(exampleDataUser);
                done("should have thrown HttpException");

            } catch(err){

                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe('Username is required');
                // console.log(err);
                done();

            }
        });
        it('Should reject with HttpException if "username" given exist username', async(done) => {

            exampleDataUser.username = "zainal1";

            userRepositoryMock.findOne.mockResolvedValueOnce(null);
            userRepositoryMock.findOne.mockResolvedValueOnce(exampleDataUser as any);

            try{

                await userService.create(exampleDataUser);
                done("should have thrown HttpException");


            } catch(err){
                expect(userRepositoryMock.findOne).toHaveBeenCalledWith({username: "zainal1"});

                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe('Username is exist');
                // console.log(err);
                done();

            }
        });
        it('Should reject with HttpException if "email" given wrong format email ', async(done) => {
            
            exampleDataUser.email = "zainal3@online-pajakcom";

            try{

                await userService.create(exampleDataUser);
                done("should have thrown HttpException");

            } catch(err){

                expect(err).toBeInstanceOf(HttpException);
                expect(err.message).toBe('Email is invalid format');
                // console.log(err);
                done();

            }
        });
    });
});
