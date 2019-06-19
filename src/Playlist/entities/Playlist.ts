
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";
import { Podcast } from "../../Podcast/entities/Podcast";
import { User } from "../../User/entities/User";

@Entity()
export class Playlist{

    @PrimaryGeneratedColumn()
    id:number;

    @ApiModelProperty()
    @Column()
    title: string;

    @ManyToOne( type => User, user => user.playlists )
    user: User;

    @ManyToMany( type => Podcast, podcast => podcast.playlists)
    @JoinTable()
    podcasts: Podcast[];

}