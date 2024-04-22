import { UserRole } from "@prisma/client";
import { Request } from "express";

interface IError {
    message: string 
    stack?: string 
    name?: string 
    statusCode: number
}

interface IRequest<T> extends Request {
    body: T ,
    user?: {
        id: number ,
        role: UserRole
    } 
}
export {IError , IRequest}