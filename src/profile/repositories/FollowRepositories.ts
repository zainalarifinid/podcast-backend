import { EntityRepository } from "typeorm";
import { Follow } from "../entities/Follow";
import { BaseSqlRepository } from "../../Common/BaseSqlRepository";

@EntityRepository(Follow)
export class FollowRepository extends BaseSqlRepository<Follow>{

}
