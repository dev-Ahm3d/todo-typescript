import asyncHandler from 'express-async-handler'
import bcrypt, { compare, hash } from "bcrypt" 
import { Request, Response } from 'express'
import prisma from '../utils/db'
import { MESSAGES } from '../utils/enums'
import {  User } from '@prisma/client'
import { CreateUserType, UpdatePasswordType, UpdateUserType } from '../utils/types'
import { prismaExclude } from '../utils/helpers'
import { IRequest } from '../utils/interfaces'
import { StatusCodes } from 'http-status-codes'
import jwt from "jsonwebtoken"
import configs from '../utils/config'


const register = asyncHandler(async (req:Request<{},{},CreateUserType> , res:Response) : Promise<any> =>{
    const userData:CreateUserType = req.body 
    const newUser = await prisma.user.create({
        data :{
            ...userData , 
            password: await bcrypt.hash(userData.password , 10) 
        },
        select: prismaExclude("User",["password"])
    })
    return res.status(StatusCodes.CREATED).json({
        data : newUser ,
        message : MESSAGES.CREATED_SUCCESSFULLTY
    })
})

const login = asyncHandler(async (req:Request<{},{},User> , res:Response) : Promise<any> =>{
    const {email , password} = req.body
    const user = await prisma.user.findUnique({where:{email}})
    if(user && (await bcrypt.compare(password , user.password))){
        return res.status(StatusCodes.OK).json({
            message : MESSAGES.SUCCESSFULL_LOGIN ,
            token: jwt.sign({
                id: user.id ,
                role: user.role ,
                email: user.email
            },configs.JWT_SECRET)
        })
    }
    return res.status(401).json({
        message : MESSAGES.INVALID_CREDENTIALS
    })
})

const allowedSearchFields = ["id", "name" , "email" , "role"]  
const getUsers = asyncHandler(async (req:IRequest<User> , res:Response):Promise<any> =>{
    const {query={}} = req 
    const keys = Object.keys(query) 
    if(!keys.every(key => allowedSearchFields.includes(key))){
        return res.status(StatusCodes.BAD_REQUEST).json({
            message : MESSAGES.SOMETHING_WENT_WRONG
        })
    }
    const users = await prisma.user.findMany({
        where : query ,
        select : prismaExclude("User",["password","deletedAt"])
    })
    return res.status(StatusCodes.OK).json({
        data : users
    })
})

const getUserProfile = asyncHandler(async (req:IRequest<User> , res:Response):Promise<any> =>{
    const userId = req.user?.id  
    const user = await prisma.user.findUnique({
        where:{
            id: userId
        },
        select: prismaExclude("User",["password","deletedAt"])
    })
    return res.status(StatusCodes.OK).json({
        data : user
    })
})

const updateUserData = asyncHandler(async (req: IRequest<UpdateUserType>, res: Response) : Promise<any> => {
    delete req.body?.password
    const updatedUser = await prisma.user.update({
        where:{
            id: req.user?.id 
        },
        data: req.body ,
        select: prismaExclude("User",["password","createdAt","updatedAt","deletedAt"])
    })
    return res.status(StatusCodes.OK).json({
        data : updatedUser ,
        message : MESSAGES.UPDATED_SUCCESSFULLTY 
    })
})

const changeUserPassword = asyncHandler(async (req:IRequest<UpdatePasswordType>, res:Response) : Promise<any> =>{
    const {current_password , new_password} = req.body 
    const user = await prisma.user.update({
        where:{
            id: req.user?.id , 
            password: await hash(current_password , 10)
        },
        data:{
            password: await hash(new_password , 10)
        }
    })
    if(!user) return res.status(StatusCodes.FORBIDDEN).json({
        message: MESSAGES.CURRENT_PASSWORD_IS_INCORRECT
    }) 
    return res.status(StatusCodes.OK).json({
        message : MESSAGES.UPDATED_SUCCESSFULLTY + " ,you will be reirected to login page"
    })
})


const removeUser = asyncHandler(async(req:Request,res:Response) : Promise<any> =>{
    const userId = +req.params.id 
    await prisma.user.softDelete({id:userId})
    return res.status(StatusCodes.NO_CONTENT)
})


export {register , login , getUserProfile , getUsers , updateUserData , changeUserPassword , removeUser}

