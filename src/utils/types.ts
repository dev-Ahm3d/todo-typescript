import { UserRole } from "@prisma/client"

type CreateUserType = {
    name: string
    email: string
    password: string
    role?: UserRole
}

type UpdateUserType = {
    name?:  string
    email?: string
    password?: string
    role?: UserRole
}

type UpdatePasswordType = {
    new_password: string ,
    current_password: string
}

type CreateTaskType = {
    user_id: number 
    title: string 
    date: Date 
    description: string 
}

type ResponseType<T> = {
    data?: T 
    message: string
}

export {ResponseType , CreateUserType , UpdateUserType  , UpdatePasswordType, CreateTaskType}