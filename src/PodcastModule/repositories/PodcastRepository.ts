import { EntityRepository } from "typeorm";
import { Podcast } from "../entities/Podcast";
import { BaseSqlRepository } from "../../Common/BaseSqlRepository";

@EntityRepository(Podcast)
export class PodcastRepository extends BaseSqlRepository<Podcast>{

}