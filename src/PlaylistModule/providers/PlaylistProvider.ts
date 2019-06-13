import { Connection } from "typeorm";
import { Playlist } from "../entities/Playlist";

export const playlistProvider = [
    {
        provide: 'PLAYLIST_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(Playlist),
        inject: ['DATABASE_CONNECTION']
    }
]
