import { z } from 'zod';

export const createOrUpdateTaskSchema = z.object({
    title: z
    .string({
        required_error:"required" ,
        invalid_type_error:"must be a string"
    })
    .min(1,"must be at least 1 characters")
    .max(300,"must be at most 300 characters"),

    description: z
    .string({
        required_error:"required" ,
        invalid_type_error:"must be a string"
    })
    .min(1,"must be at least 1 characters")
    .max(2000,"must be at most 2000 characters") ,

    date: z
    .date({
        required_error:"required" , 
        invalid_type_error:"must be a date",
        coerce: true
    })
    .min(new Date(), "date must be in the future")
}) 
