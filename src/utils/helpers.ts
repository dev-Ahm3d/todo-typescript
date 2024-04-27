import { Prisma } from '@prisma/client';
import prisma from './db';

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
    keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
    string
>;

export function prismaExclude<T extends Entity, K extends Keys<T>>(
    type: T,
    omit: K[],
) {
    type Key = Exclude<Keys<T>, K>;
    type TMap = Record<Key, true>;
    const result: TMap = {} as TMap;
    for (const key in Prisma[`${type}ScalarFieldEnum`]) {
        if (!omit.includes(key as K)) {
        result[key as Key] = true;
        }
    }
    return result;
}


export const removeNotAllowedFields = (allowedFields: string[],obj:any) =>{
    const filteredObj:any = {}
    const keys = Object.keys(obj)
    keys.forEach(key => {
        if(allowedFields.includes(key)){
            filteredObj[key] = obj[key] 
        }
    })
    return filteredObj
}

export const checkThatCurrentUserIsTheTaskOwner = async(userId:number , taskId:number) : Promise<boolean> =>{
    const task = await prisma.task.findUnique({
        where:{
            id: taskId , 
            user_id: userId
        }
    })
    return !!task
}


export class CustomError extends Error{
    private readonly statusCode:number
    constructor(statusCode:number , message:string){
        super(message)
        this.message = message
        this.statusCode = statusCode
    }
}