import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createTaskController, deleteTaskController, getTasksController, updateTaskController } from "../controllers/tasks.controller";

const router = Router()

router.get("/", authMiddleware, getTasksController)
router.post("/", authMiddleware, createTaskController)
router.patch("/:id", authMiddleware, updateTaskController)
router.delete("/:id", authMiddleware, deleteTaskController)

export default router