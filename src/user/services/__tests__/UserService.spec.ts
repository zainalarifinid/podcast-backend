import { UserService } from "../UserService";
import { User } from "../../entities/User";
import { Repository } from "typeorm";
import { HttpException } from "@nestjs/common";

// jest.mock('../../entities')
describe('UserService', () => {
    let userService: UserService;
    let userRepository: Repository<User>;

    beforeEach(()=>{
        userRepository = new Repository<User>();
        userService = new UserService(userRepository);
    });

    describe('create', () => {
        it('Should reject with HttpException if "email" given empty string ', async(done) => {

            const exampleDataUser = new User();
            exampleDataUser.email = "";
            exampleDataUser.username = "zainal3";

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
        // it('Should reject with HttpException if "email" given exist email', async(done) => {

        //     const exampleDataUser = new User();
        //     exampleDataUser.email = "zainal1@online-pajak.com";
        //     exampleDataUser.username = "zainal1";

        //     try{

        //         await userService.create(exampleDataUser);
        //         done("should have thrown HttpException");

        //     } catch(err){

        //         expect(err).toBeInstanceOf(HttpException);
        //         expect(err.message).toBe('Email is Exist');
        //         // console.log(err);
        //         done();

        //     }
        // });
        it('Should reject with HttpException if "username" given empty string ', async(done) => {

            const exampleDataUser = new User();
            exampleDataUser.email = "zainal3@online-pajak.com";
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
        it('Should reject with HttpException if "email" given wrong format email ', async(done) => {

            const exampleDataUser = new User();
            exampleDataUser.email = "zainal3@online-pajakcom";
            exampleDataUser.username = "zainal3";

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
