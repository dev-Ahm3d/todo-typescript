import prisma from "../utils/db"
import { CustomResponse, IRequest } from "../utils/interfaces"
import { MESSAGES } from "../utils/enums"
import asyncHanlder from "express-async-handler"
import { CreateTaskType, UpdateTaskType } from "../utils/types"
import { checkThatAllFieldsAreAllowed, checkThatCurrentUserIsTheTaskOwner } from "../utils/helpers"
import { StatusCodes } from "http-status-codes"


const createTask = asyncHanlder(async (req: IRequest<CreateTaskType>, res: CustomResponse) : Promise<any> => {
    const task = await prisma.task.create({
        data:{
            ...req.body ,
            user_id: req.user.id ,
        }
    })
    return res.status(201).json({
        success: true ,
        data : task ,
        message : MESSAGES.CREATED_SUCCESSFULLTY 
    })
})


const updateTask = asyncHanlder(async (req: IRequest<UpdateTaskType>, res: CustomResponse) : Promise<any> => {
    const fieldsAreAllowed = checkThatAllFieldsAreAllowed(["title" , "description"], req.body)
    const isTaskOwner = await checkThatCurrentUserIsTheTaskOwner(req.user.id , +req.params.id)
    if(!fieldsAreAllowed || !isTaskOwner){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false ,
            message: MESSAGES.UNAUTHORIZED 
        })
    } 
    const task = await prisma.task.update({
        where:{
            user_id: req.user.id ,
            id: +req.params.id
        },
        data: req.body
    })  
    return res.status(StatusCodes.OK).json({
        success: false ,
        data : task ,
        message : MESSAGES.UPDATED_SUCCESSFULLTY 
    }) 
})



export {
    createTask , 
    updateTask
}