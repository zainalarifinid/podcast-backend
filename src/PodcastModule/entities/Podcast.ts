import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";
import { User } from "../../user/entities/User";

@Entity()
export class Podcast{
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @Column()
    title: string;

    @ApiModelProperty()
    @Column()
    duration: string;

    @ApiModelProperty()
    @Column()
    description: string;

    @ApiModelProperty()
    @Column()
    youtubeLink: string;

    @ManyToOne(type => User, user => user.podcasts )
    user: User;

}
