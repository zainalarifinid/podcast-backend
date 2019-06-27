import { ApiModelProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class UserEditDto{

    @ApiModelProperty()
    @Column()
    id: number;

    @ApiModelProperty()
    @Column()
    email: string;
    
    @ApiModelProperty()
    @Column()
    username: string;

    @ApiModelProperty()
    @Column()
    password: string;

    @ApiModelProperty()
    @Column()
    oldPassword: string;

}
