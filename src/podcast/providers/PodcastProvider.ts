import { Connection } from "typeorm";
import { PodcastEntity } from "../entities/Podcast";

export const podcastProvider = [
    {
        provide: 'PODCAST_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(PodcastEntity),
        inject: ['DATABASE_CONNECTION']
    }
]
