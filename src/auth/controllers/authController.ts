import { ApiUseTags, ApiOperation } from "@nestjs/swagger";
import { Controller, Inject, Post, Body, Get, HttpException, HttpStatus } from "@nestjs/common";
import { UserService } from "../../user/services/UserService";
import { User } from "../../user/entities/User";
import { LoginUserDto } from "../../user/entities/Login.dto";
import { AuthService } from "../services/AuthService";

@ApiUseTags('Auth')
@Controller('/api/v1/auth')
export class AuthController {

    constructor(
        @Inject("PodcastApp.UserService")
        private userService: UserService,
        @Inject("PodcastApp.AuthService")
        private authService: AuthService
    ) {}

    @Post("register")
    @ApiOperation({
        title: 'Register User',
        description: 'The API to register user from public'
    })
    async register(@Body() user: User){

        return this.userService.create(user);

    }

    @Post("login")
    @ApiOperation({
        title: 'Login User',
        description: 'The API login to get token from JWT'
    })
    async login(@Body() loginUser: LoginUserDto){
        return await this.userService.findOne(loginUser.email).then( user => {
            if (!user){
                throw new HttpException("User Not Found", HttpStatus.BAD_REQUEST);
            }else{
                return this.authService.createToken(user);
            }
        } )
    }

    @Post("verify")
    @ApiOperation({
        title: 'Verify the Token',
        description: 'The API Verify to Verify the token'
    })
    async verify(@Body() token: string){
        return this.authService.validateUser(token);
    }

}
