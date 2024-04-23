import { Request ,NextFunction, Router } from "express";
import { validateData } from "../../middlewares/validation.middleware";
import { changeUserPasswordSchema, userLoginSchema, userRegistrationSchema, userUpdateSchema } from "../../schemas/user.schema";
import { changeUserPassword, getUsers, login, register, removeUser, updateUserData } from "../../controllers/users.controller";
import { StatusCodes } from "http-status-codes";
import { MESSAGES } from "../../utils/enums";
import { CustomResponse } from "../../utils/interfaces";

const routes = Router() 

routes
.get("/", getUsers)
.post("/register", validateData(userRegistrationSchema), register)
.post("/login", validateData(userLoginSchema) , login)
.patch("/update" , validateData(userUpdateSchema) , updateUserData)
.patch("/change-password" , validateData(changeUserPasswordSchema) , changeUserPassword)
.delete("/remove/:id" , (req:Request, res:CustomResponse, next:NextFunction) =>{
    if(!(+req.params.id)){
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false ,
            message : MESSAGES.SOMETHING_WENT_WRONG
        })
    }
    next()
}, removeUser)

export default routes