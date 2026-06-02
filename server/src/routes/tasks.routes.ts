import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getTasksController } from "../controllers/tasks.controller";

const router = Router()

const tasksRouter = router.get("/", authMiddleware, getTasksController)

export { tasksRouter }