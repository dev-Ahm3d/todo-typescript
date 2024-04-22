import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { MESSAGES } from "../utils/enums";
import jwt from "jsonwebtoken";
import configs from "../utils/config";
import { IRequest } from "../utils/interfaces";

export const isAuth = (req:IRequest<any>, res:Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization || req.headers.Authorization 
    if(!bearerToken) return res.status(StatusCodes.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED}) 
    else {
        try {
            const token = (bearerToken as string).split(" ")[1] 
            const decodedData:any = jwt.verify(token, configs.JWT_SECRET)
            //const {id,role} = decodedData
            req.user = decodedData
            next()
        } catch (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
        }
    }
}