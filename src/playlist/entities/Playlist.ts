import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";
import { Podcast } from "../../podcast/entities/Podcast";
import { User } from "../../user/entities/User";

@Entity()
export class Playlist{

    @PrimaryGeneratedColumn()
    id:number;

    @ApiModelProperty()
    @Column()
    title: string;

    @ManyToOne( type => User, user => user.playlists )
    user: User;

    @ManyToMany( type => Podcast)
    @JoinTable()
    podcasts: Podcast[];

}