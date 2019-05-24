import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Podcast } from '../../podcast/entities/Podcast';

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

    @OneToMany( type => Podcast, podcast => podcast.user)
    podcasts: Podcast[]

}
