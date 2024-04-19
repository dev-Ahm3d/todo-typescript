import { NextFunction , Response , Request} from "express"
import { IError } from "../utils/interfaces";

const globalError = (err:IError,_req:Request,res:Response,_next:NextFunction)=>{
    //console.log(err)
    const {name , statusCode = 500, stack , message} = err
    const errorObj = {name, stack, statusCode, message}
    if(process.env.NODE_ENV !== 'development'){
        delete errorObj?.name 
        delete errorObj?.stack
    }
    return res.status(errorObj.statusCode).json(errorObj)
}

export default globalError 