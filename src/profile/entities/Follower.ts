import { Entity, Column } from "typeorm";

@Entity()
export class Follower{
    
    @Column()
    usernameFollower: string;

}
