import { z } from 'zod';
import prisma from '../utils/db';

const passRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

const userRegistrationSchema = z.object({
    name: z
    .string({
        required_error:"required" ,
        invalid_type_error:"must be a string"
    })
    .min(3,"must be at least 3 characters")
    .max(20,"must be at most 20 characters"),

    email: z
    .string({
        required_error:"required" ,
        invalid_type_error:"must be a string"
    })
    .min(3,"must be at least 3 characters")
    .max(100,"must be at most 20 characters")
    .email("field must be a valid email")
    .refine(async email =>{
        const user = await prisma.user.findUnique({where:{email}})
        return (!user) 
    } , "already exists") ,

    password: z
    .string({
        required_error:"password is required" ,
        invalid_type_error:"password must be a string"
    })
    .min(6, "password must be at least 6 characters")
    .max(20, "password must be at most 20 characters")
    // .regex(
    //     passRegex ,
    //     "must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    // )
})

const userLoginSchema = z.object({
    email: z
    .string({
        required_error:"required" ,
        invalid_type_error:"must be a string"
    })
    .min(3,"must be at least 3 characters")
    .max(100,"must be at most 20 characters")
    .email("must be a valid email") ,

    password: z
    .string({
        required_error:"required" ,
        invalid_type_error:"must be a string"
    })
    .min(6, "must be at least 6 characters")
    .max(20, "must be at most 20 characters")
})

const userUpdateSchema = z.object({
    name: z
    .string({
        required_error:"required" ,
        invalid_type_error:"must be a string"
    })
    .min(3,"must be at least 3 characters")
    .max(20,"must be at most 20 characters")
    .optional() ,

    email: z
    .string({
        required_error:"is required" ,
        invalid_type_error:"must be a string"
    })
    .min(3, "must be at least 3 characters")
    .max(100,"must be at most 20 characters")
    .email("field must be a valid email")
    .refine(async email =>{
        const user = await prisma.user.findUnique({where:{email}})
        return (!user) 
    } , "already exists") 
    .optional()
})

const changeUserPasswordSchema = z.object({
    current_password: z
    .string({
        required_error:"required" ,
        invalid_type_error:"must be a string"
    })
    .min(6, "must be at least 6 characters")
    .max(20, "must be at most 20 characters") ,

    new_password: z
    .string({
        required_error:"required" ,
        invalid_type_error:"must be a string"
    })
    .min(6, "must be at least 6 characters")
    .max(20, "must be at most 20 characters")
    // .regex(
    //     passRegex,
    //     "new password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    // )
})

export {userRegistrationSchema , userLoginSchema , userUpdateSchema , changeUserPasswordSchema}