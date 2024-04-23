import { UserRole } from "@prisma/client"

type CreateUserType = {
    name: string
    email: string
    password: string
    role?: UserRole
}

type UpdateUserType = Partial<Omit<CreateUserType,"password" | "role">>

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


type UpdateTaskType = Partial<Omit<CreateTaskType,"user_id">>


export {CreateUserType , UpdateUserType  , UpdatePasswordType, CreateTaskType , UpdateTaskType}