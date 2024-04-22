import { NextFunction, Request, Response } from "express";
import { IRequest } from "../utils/interfaces";
import { StatusCodes } from "http-status-codes";
import { MESSAGES } from "../utils/enums";

export const isAdmin = (req: IRequest<any>, res:Response, next: NextFunction) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(StatusCodes.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED});
    } else next() 
}