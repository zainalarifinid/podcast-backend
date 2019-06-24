import { ApiModelProperty } from "@nestjs/swagger";

export class PlaylistPodcastDto{

    @ApiModelProperty()
    username: string;

    @ApiModelProperty()
    idPodcast: number;

}
