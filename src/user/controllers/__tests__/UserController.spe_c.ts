import { UsersController } from "../UserController";
import { UserService } from "../../services/UserService";
import { Repository } from "typeorm";
import { User } from "../../entities/User";
import { Test } from "@nestjs/testing";
import { userProvider } from "../../providers/UserProvider";

// describe('UserController', () => {
//     let userController: UsersController;
//     let userService: UserService;
//     let userRepository: Repository<User>;

    // beforeEach( async ()=>{
    //     // userService = new UserService(userRepository);
    //     // userController = new UsersController(userService);

    //     const module = await Test.createTestingModule({
    //         controllers: [UsersController],
    //         providers: [
    //             userProvider,
    //             UserService
    //         ]
    //     }).compile();

    //     userService = module.get<UserService>(userService);
    //     userController = module.get<UsersController>(userController);

    // });

    // describe('findAll', () => {
    //     it('should return an array of User', async() => {
    //         const result = ['test'];
    //         jest.spyOn(userService, 'findAll').mockImplementation( () => result );

    //         expect(await userController.index()).toBe(result);

    //     })
    // })

// })
