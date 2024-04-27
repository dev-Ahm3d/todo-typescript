import { Router } from "express";
import { createTask, deleteTask, getTasks, restoreTask, updateTask } from "../../controllers/tasks.controller";
import { validateData } from "../../middlewares/validation.middleware";
import { createOrUpdateTaskSchema } from "../../schemas/task.schema";

const routes = Router() 
routes
.route("/")
.get(getTasks)
.post(validateData(createOrUpdateTaskSchema) , createTask)

routes
.route("/:id")
.patch(validateData(createOrUpdateTaskSchema) , updateTask) 
.delete(deleteTask)

routes.patch("/:id/restore" , restoreTask)

export default routes