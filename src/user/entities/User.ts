import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Podcast } from '../../podcast/entities/Podcast';
import { Playlist } from '../../playlist/entities/Playlist';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @Column({length: 150})
    email: string;

    @ApiModelProperty()
    @Column({length: 150})
    username: string;

    @OneToMany( type => Playlist, playlist => playlist.user )
    playlists: Playlist[];

    @OneToMany( type => Podcast, podcast => podcast.user)
    podcasts: Podcast[];

}
