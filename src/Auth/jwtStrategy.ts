import { Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from "../User/services/UserService";
import config from "../../config";
import { JwtPayload } from "./jwtPayload";
import { USER_SERVICE } from "../User/constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @Inject(USER_SERVICE)
        private readonly userService: UserService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtPrivateKey
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.getUserByEmail(payload.email);
        if (!user) {

            throw new UnauthorizedException();
        }

        return user;
    }

}
