import prisma from "../utils/db"
import { CustomResponse, IRequest } from "../utils/interfaces"
import { MESSAGES } from "../utils/enums"
import asyncHanlder from "express-async-handler"
import { CreateTaskType, UpdateTaskType } from "../utils/types"
import { removeNotAllowedFields , CustomError, prismaExclude } from "../utils/helpers"
import { StatusCodes } from "http-status-codes"
import { NextFunction, Request } from "express"
import { Task } from "@prisma/client"


const getTasks = asyncHanlder(async (req: Request, res: CustomResponse) : Promise<any> => {
    const filteredQuery = removeNotAllowedFields(["id", "title" , "description" , "status"],req.query)
    const tasks = await prisma.task.findMany({
        where:{
            ...filteredQuery ,
            user_id: req.user.id
        }
    })
    res.status(200).json({
        success: true ,
        data : tasks
    })
})

const createTask = asyncHanlder(async (req: IRequest<CreateTaskType>, res: CustomResponse) : Promise<any> => {
    const task = await prisma.task.create({
        data:{
            ...req.body ,
            date: new Date(req.body.date) ,
            user_id: req.user.id ,
        },
        select: prismaExclude("Task",["createdAt","updatedAt","deletedAt"])
    })
    res.status(201).json({
        success: true ,
        data : task ,
        message : MESSAGES.CREATED_SUCCESSFULLY 
    })
})


const updateTask = asyncHanlder(
    async (req: IRequest<UpdateTaskType>, res: CustomResponse , next:NextFunction ) : Promise<any> => {
        const {id:taskId} = req.params 
        if(!(+taskId)) return next(new CustomError(StatusCodes.BAD_REQUEST, MESSAGES.SOMETHING_WENT_WRONG))
        const dataFiltered = removeNotAllowedFields(["title" , "description" , "date"], req.body)
        if(dataFiltered["date"]) dataFiltered["date"] = new Date(dataFiltered["date"])
        let task: Partial<Task>
        try {
            task = await prisma.task.update({
                where:{
                    user_id: req.user.id ,
                    id: +taskId
                },
                data: {...dataFiltered} ,
                select:{
                    id: true , 
                    title: true , 
                    description: true ,
                    user_id: true
                }
            })  
        } catch (error) {
            return next(new CustomError(StatusCodes.FORBIDDEN, MESSAGES.NOT_ALlOWED))
        }
        res.status(StatusCodes.OK).json({
            success: false ,
            data : task ,
            message : MESSAGES.UPDATED_SUCCESSFULLY 
        }) 
})

const deleteTask = asyncHanlder(async (req:Request, res:CustomResponse , next:NextFunction) : Promise<any> =>{
    const {id} = req.params    
    if(!id) return next(new CustomError(StatusCodes.BAD_REQUEST,MESSAGES.SOMETHING_WENT_WRONG))
    try {
        await prisma.task.softDelete({
            id: +id , 
            user_id: req.user.id
        }) 
    } catch (error) {
        return next(new CustomError(StatusCodes.FORBIDDEN,MESSAGES.NOT_ALlOWED))
    }
    res.status(StatusCodes.NO_CONTENT).json()
})


const restoreTask = asyncHanlder(async(req:Request, res:CustomResponse , next:NextFunction) : Promise<any> =>{
    const {id} = req.params
    if(!(+id)) return next(new CustomError(StatusCodes.BAD_REQUEST,MESSAGES.SOMETHING_WENT_WRONG))
    let task: Partial<Task>
    try {
        task = await prisma.task.softRestore({
            id: +id , 
            user_id: req.user.id
        }) 
    } catch (error) {
        return next(new CustomError(StatusCodes.FORBIDDEN,MESSAGES.NOT_ALlOWED))
    }
    res.status(StatusCodes.OK).json({
        success: true ,
        message: "task restored successfully" ,
        data: task
    })
})

export {
    createTask , 
    updateTask ,
    deleteTask , 
    getTasks ,
    restoreTask
}




