import { ApiModelProperty } from '@nestjs/swagger';

export class Follower{

    @ApiModelProperty()
    readonly usernameFollower: string;

}
