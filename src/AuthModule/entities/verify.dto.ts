import { ApiModelProperty } from "@nestjs/swagger";

export class VerifyDto{
    @ApiModelProperty()
    readonly token: string;
}
