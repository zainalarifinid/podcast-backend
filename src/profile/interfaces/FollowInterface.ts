import { Podcast } from "../../podcast/entities/Podcast";

export interface ProfileData {
    username: string,
    podcasts: Podcast[],
    following?: boolean
}

export interface ProfileRO {
    profile: ProfileData
}
