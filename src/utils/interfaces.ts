import { UserRole } from "@prisma/client";
import { Request, Response } from "express";

declare module "express-serve-static-core" {
    interface Request {
        user: {
            id:number ,
            role:UserRole
        }
    }
}


interface IError {
    message: string 
    stack?: string 
    name?: string 
    statusCode: number
}

interface IRequest<T> extends Request {
    body: T 
}

interface Json {
    success?: boolean ,
    message?:string ,
    data?: any
}

type Send<T = Response> = (body?: Json) => T;

interface CustomResponse extends Response {
    json: Send<this>
}

export {IError , IRequest , CustomResponse }