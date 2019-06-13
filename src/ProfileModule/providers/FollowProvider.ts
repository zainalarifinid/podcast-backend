import { Connection } from "typeorm";
import { Follow } from "../entities/Follow";

export const followProvider = {
    provide: 'FOLLOW_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Follow),
    inject: ['DATABASE_CONNECTION']
}
