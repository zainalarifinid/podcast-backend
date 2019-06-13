import { Podcast } from "../../Podcast/entities/Podcast";

export interface ProfileData {
    username: string,
    podcasts: Podcast[],
    following?: boolean
}

export interface ProfileRO {
    profile: ProfileData
}
