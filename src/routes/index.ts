import { Router } from "express";
import usersRouter from "./api/users.route"
import { getUserProfile } from "../controllers/users.controller";
import { isAuth } from "../middlewares/auth.middleware";

const routes = Router() 

routes.get("/profile" , isAuth , getUserProfile)
routes.use("/users" , isAuth , usersRouter)

export default routes 