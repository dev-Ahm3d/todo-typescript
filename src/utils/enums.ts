import { rate_limit_minutes } from "./constants";

export enum MESSAGES {
    CREATED_SUCCESSFULLY = "created successfully" ,
    UPDATED_SUCCESSFULLY = "updated successfully" ,
    DELETED_SUCCESSFULLY = "deleted successfully" ,
    SOMETHING_WENT_WRONG = "something went wrong" ,
    RATE_LIMIT = `too many requests , please try again after ${rate_limit_minutes} minutes` , 
    SUCCESSFULL_LOGIN = "successfull login" ,
    INVALID_CREDENTIALS = "email or password is incorrect" ,
    CURRENT_PASSWORD_IS_INCORRECT = "current password is incorrect" ,
    UNAUTHORIZED = "you are unauthorized",
    NOT_ALlOWED = "you are not allowed" ,
    NOT_FOUND = "not found" ,
    RESTORED_SUCCESSFULLY = "restored successfully"
}   