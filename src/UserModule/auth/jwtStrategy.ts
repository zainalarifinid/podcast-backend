import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from "../services/UserService";
import config from "../../../config";
import { JwtPayload } from "./jwtPayload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userService: UserService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtPrivateKey
        });
    }

    async validate(payload: JwtPayload, done: VerifiedCallback) {
        // const user = await this.userService.getUserByEmail(payload.email);
        // if (!user) {
        //     return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
        // }

        // return done(null, user, payload.iat);
    }

}
