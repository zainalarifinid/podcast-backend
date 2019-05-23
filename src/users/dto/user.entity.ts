import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: Number;

    @Column({length: 150})
    email: string;

    @Column({length: 150})
    username: string;

}
