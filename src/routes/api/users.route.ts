import { Request ,NextFunction, Router } from "express";
import { validateData } from "../../middlewares/validation.middleware";
import { changeUserPasswordSchema , userUpdateSchema } from "../../schemas/user.schema";
import { changeUserPassword, getUsers, removeUser, updateUserData } from "../../controllers/users.controller";
import { StatusCodes } from "http-status-codes";
import { MESSAGES } from "../../utils/enums";
import { CustomResponse } from "../../utils/interfaces";
import { isAdmin } from "../../middlewares/admin.middleware";
import { CustomError } from "../../utils/helpers";

const routes = Router() 

routes
.get("/", isAdmin ,getUsers)
.patch("/" , validateData(userUpdateSchema) , updateUserData)
.delete("/:id" , isAdmin ,(req:Request, _res:CustomResponse, next:NextFunction) =>{
    if(!(+req.params.id)) return next(new CustomError(StatusCodes.BAD_REQUEST,MESSAGES.SOMETHING_WENT_WRONG))
    next()
}, removeUser)
.patch("/change-password" , validateData(changeUserPasswordSchema) , changeUserPassword)

export default routes