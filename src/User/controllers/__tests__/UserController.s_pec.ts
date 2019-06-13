import { UsersController } from "../UserController";
import { UserService } from "../../services/UserService";
import { Repository } from "typeorm";
import { User } from "../../entities/User";
import { Test } from "@nestjs/testing";
import { userProvider } from "../../providers/UserProvider";

jest.mock('../../services/UserService');

describe('UserController', () => {
    let userController: UsersController;
    let userService: UserService;
    let userRepository: Repository<User>;

    beforeEach( async ()=>{
        userService = new UserService(userRepository);
        userController = new UsersController(userService);

        const module = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                userProvider,
                UserService
            ]
        }).compile();

        userService = module.get<UserService>(UserService);
        userController = module.get<UsersController>(UsersController);

    });

    // describe('findAll', () => {
    //     it('should return an array of User', async() => {
    //         const result: Promise<User[]> = [{
    //             id: 1,
    //             email: "zainal1@online-pajak.com",
    //             username: "zainal1",
    //             podcasts: []
    //         }];
    //         jest.spyOn(userService, 'findAll').mockImplementation( () => result );

    //         expect(await userController.index()).toBe(result);

    //     })
    // })

})
