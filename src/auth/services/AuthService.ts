import * as jwt from 'jsonwebtoken';
import { Injectable } from "@nestjs/common";
import { User } from "../../user/entities/User";

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

    async validateUser(token: string){
        console.log(token);
        const result = jwt.verify(token, keySecret);
        console.log(result);
        return result;

    }

}