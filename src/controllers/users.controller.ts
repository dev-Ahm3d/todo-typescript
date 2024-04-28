import asyncHandler from 'express-async-handler'
import { compare, hash } from "bcrypt" 
import { NextFunction, Request, Response } from 'express'
import prisma from '../utils/db'
import { MESSAGES } from '../utils/enums'
import {  User } from '@prisma/client'
import { CreateUserType, UpdatePasswordType, UpdateUserType } from '../utils/types'
import { CustomError, prismaExclude, removeNotAllowedFields } from '../utils/helpers'
import { CustomResponse, IRequest } from '../utils/interfaces'
import { StatusCodes } from 'http-status-codes'
import jwt from "jsonwebtoken"
import configs from '../utils/config'

const register = asyncHandler(async (req:Request<{},{},CreateUserType> , res:CustomResponse) : Promise<any> =>{
    const userData:CreateUserType = req.body 
    const newUser = await prisma.user.create({
        data :{
            ...userData , 
            password: await hash(userData.password + configs.SECRET_PEPPER, 10) 
        },
        select: prismaExclude("User",["password","role","deletedAt","createdAt","updatedAt"])
    })
    res.status(StatusCodes.CREATED).json({
        success: true ,
        data : newUser ,
        message : MESSAGES.CREATED_SUCCESSFULLY
    })
})

const login = asyncHandler(async (req:Request<{},{},User> , res:Response , next:NextFunction) : Promise<any> =>{
    const {email , password} = req.body
    const user = await prisma.user.findUnique({where:{email}})
    if(user && (await compare(password + configs.SECRET_PEPPER, user.password))){
        return res.status(StatusCodes.OK).json({
            success: true ,
            message : MESSAGES.SUCCESSFULL_LOGIN ,
            token: jwt.sign({
                id: user.id ,
                role: user.role ,
                email: user.email
            },configs.JWT_SECRET)
        })
    }
    next(new CustomError(StatusCodes.UNAUTHORIZED , MESSAGES.INVALID_CREDENTIALS))
})


const getUsers = asyncHandler(async (req:IRequest<User> , res:CustomResponse):Promise<any> =>{
    const {query={}} = req 
    const queryFiltered = removeNotAllowedFields(["id", "name" , "email" , "role"],query)
    const users = await prisma.user.findMany({
        where : queryFiltered ,
        select : prismaExclude("User",["password","deletedAt"])
    })
    res.status(StatusCodes.OK).json({
        data : users 
    })
})


const getUserProfile = asyncHandler(async (req:IRequest<User> , res:CustomResponse):Promise<any> =>{
    const userId = req.user.id  
    const user = await prisma.user.findUnique({
        where:{
            id: userId
        },
        select: prismaExclude("User",["password","deletedAt","createdAt","updatedAt"])
    })
    res.status(StatusCodes.OK).json({
        data : user
    })
})


const updateUserData = asyncHandler(async (req: IRequest<UpdateUserType>, res: CustomResponse) : Promise<any> => {
    const updatedUser = await prisma.user.update({
        where:{
            id: req.user.id 
        },
        data: req.body ,
        select: prismaExclude("User",["password","createdAt","updatedAt","deletedAt"])
    })
    res.status(StatusCodes.OK).json({
        success: true ,
        data : updatedUser ,
        message : MESSAGES.UPDATED_SUCCESSFULLY 
    })
})


const changeUserPassword = asyncHandler(
    async (req:IRequest<UpdatePasswordType>, res:CustomResponse , next:NextFunction) : Promise<any> =>{
        const {current_password , new_password} = req.body 
        const user = await prisma.user.findUnique({where:{id:req.user.id}})
        if(!(await compare(current_password , user?.password || ""))){
            return next(new CustomError(StatusCodes.FORBIDDEN , MESSAGES.CURRENT_PASSWORD_IS_INCORRECT))
        }
        await prisma.user.update({
            where:{
                id: req.user.id 
            },
            data:{
                password: await hash(new_password , 10)
            }
        })
        res.status(StatusCodes.OK).json({
            success: true ,
            message : MESSAGES.UPDATED_SUCCESSFULLY + " ,you will be reirected to login page"
        })
    }
)


const removeUser = asyncHandler(async(req:Request,res:Response) : Promise<any> =>{
    const userId = +req.params.id 
    await prisma.user.softDelete({id:userId})
    res.status(StatusCodes.NO_CONTENT).json()
})


export {
    register , 
    login , 
    getUserProfile , 
    getUsers , 
    updateUserData , 
    changeUserPassword , 
    removeUser
}
