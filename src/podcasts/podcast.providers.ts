import { Connection } from "typeorm";
import { Podcast } from "./podcast.entity";

export const podcastProvider = [
    {
        provide: 'PODCAST_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(Podcast),
        inject: ['DATABASE_CONNECTION']
    }
]
