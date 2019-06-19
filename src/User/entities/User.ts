import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, RelationCount } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Podcast } from '../../Podcast/entities/Podcast';
import { Playlist } from '../../Playlist/entities/Playlist';

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
    
    @ApiModelProperty()
    @Column()
    password: string;

    @OneToMany( type => Playlist, playlist => playlist.user )
    playlists: Playlist[];

    @OneToMany( type => Podcast, podcast => podcast.user)
    podcasts: Podcast[];

    @ManyToMany( type => User, user => user.followers )
    @JoinTable()
    followers: User[];

    @ManyToMany( type => User, user => user.followings )
    @JoinTable()
    followings: User[];

    @RelationCount((user: User) => user.followers)
    followersCount: number;
    
    @RelationCount((user: User) => user.followings)
    followingCount: number;

}
