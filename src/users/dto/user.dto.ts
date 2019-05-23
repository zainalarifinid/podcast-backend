import { ApiModelProperty } from '@nestjs/swagger';

export class UserDto{
    
    @ApiModelProperty()
    readonly email: string;

    @ApiModelProperty()
    readonly username: string;
    
}