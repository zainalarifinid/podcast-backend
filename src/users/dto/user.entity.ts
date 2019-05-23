import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: Number;

    @ApiModelProperty()
    @Column({length: 150})
    email: string;

    @ApiModelProperty()
    @Column({length: 150})
    username: string;

}
