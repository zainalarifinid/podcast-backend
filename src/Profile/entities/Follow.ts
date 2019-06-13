import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class Follow{
    
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @Column()
    followerId: number;

    @ApiModelProperty()
    @Column()
    FollowingId: number;

}
