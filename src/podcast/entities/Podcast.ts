import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";

@Entity()
export class Podcast{
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @Column()
    user: number;

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

}
