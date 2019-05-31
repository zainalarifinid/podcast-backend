import { EntityRepository } from "typeorm";
import { Playlist } from "../entities/Playlist";
import { BaseSqlRepository } from "../../Common/BaseSqlRepository";

@EntityRepository(Playlist)
export class PlaylistRepository extends BaseSqlRepository<Playlist>{

}
