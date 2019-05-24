import { Connection } from "typeorm";
import { Podcast } from "../entities/Podcast";

export const podcastProvider = [
    {
        provide: 'PODCAST_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(Podcast),
        inject: ['DATABASE_CONNECTION']
    }
]
