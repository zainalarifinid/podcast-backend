import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";
import { Podcast } from "../../podcast/entities/Podcast";

@Entity()
export class Playlist{

    @PrimaryGeneratedColumn()
    id:number;

    @ApiModelProperty()
    @Column()
    title: string;

    @ManyToMany( type => Podcast)
    @JoinTable()
    podcast: Podcast[];

}