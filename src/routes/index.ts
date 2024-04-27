import { Router } from "express";
import usersRouter from "./api/users.route"
import tasksRouter from "./api/tasks.router"
import { getUserProfile, login, register } from "../controllers/users.controller";
import { isAuth } from "../middlewares/auth.middleware";
import { validateData } from "../middlewares/validation.middleware";
import { userRegistrationSchema, userLoginSchema } from "../schemas/user.schema";

const routes = Router() 

routes
.get("/profile" , isAuth , getUserProfile)
.post("/register", validateData(userRegistrationSchema), register)
.post("/login", validateData(userLoginSchema) , login)
.use("/users" , isAuth , usersRouter)
.use("/tasks" , isAuth , tasksRouter)

export default routes 