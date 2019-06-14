import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";
import { User } from "../../User/entities/User";
import { Playlist } from "../../Playlist/entities/Playlist";

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

    @OneToMany(type => Playlist, playlist => playlist.podcasts)
    playlists: Playlist[]

}
