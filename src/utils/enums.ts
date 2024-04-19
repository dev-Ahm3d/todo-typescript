import { rate_limit_minutes } from "./constants";

export enum MESSAGES {
    CREATED_SUCCESSFULLTY = "created successfullty" ,
    UPDATED_SUCCESSFULLTY = "updated successfullty" ,
    DELETED_SUCCESSFULLTY = "deleted successfullty" ,
    RATE_LIMIT = `too many requests , please try again after ${rate_limit_minutes} minutes`
}   