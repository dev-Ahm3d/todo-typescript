import { Request, Response } from "express"
import prisma from "../utils/db"
import { IRequest } from "../utils/interfaces"
import { MESSAGES } from "../utils/enums"
import asyncHanlder from "express-async-handler"
import { CreateTaskType } from "../utils/types"

const createTask = asyncHanlder(async (req: IRequest<CreateTaskType>, res: Response) : Promise<any> => {
    const { title, description, date } = req.body
    const task = await prisma.task.create({
        data:{
            user_id: req.user?.id ,
            title,
            description,
            date
        }
    })
    return res.status(201).json({
        data : task ,
        message : MESSAGES.CREATED_SUCCESSFULLTY 
    })
})