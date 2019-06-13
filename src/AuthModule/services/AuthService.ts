import * as jwt from 'jsonwebtoken';
import { Injectable } from "@nestjs/common";
import { User } from "../../user/entities/User";
import { VerifyDto } from '../entities/verify.dto';

const keySecret = "Doremi3TanggaNada";

@Injectable()
export class AuthService{
    constructor(
        
    ) {}

    async createToken(user: User){

        const expiresIn = 3600;
        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username,
            playlists: user.playlists,
            podcasts: user.podcasts
        }, keySecret, { expiresIn });

        return {
            expiresIn,
            accessToken
        }
    }

    async validateUser(verify: VerifyDto){
        console.log(verify);
        const result = jwt.verify(verify.token, keySecret);
        console.log(result);
        return result;

    }

}