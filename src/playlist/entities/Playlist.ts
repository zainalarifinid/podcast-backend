import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";

@Entity()
export class Playlist{

    @PrimaryGeneratedColumn()
    id:number;

    @ApiModelProperty()
    @Column()
    title: string;

}