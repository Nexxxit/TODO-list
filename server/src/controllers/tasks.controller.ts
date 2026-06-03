import type { Request, Response } from "express"
import { createTask, deleteTask, getAllTasks, updateTask } from "../services/tasks.service"

const getTasksController = async (req: Request, res: Response) => {
    const result = await getAllTasks()

    return res.status(200).json({ tasks: result.allTasks })
}

const createTaskController = async (req: Request, res: Response) => {
    try {
        const creatorId = req.user?.userId

        if (!creatorId) {
            return res.status(401).json({ message: "Пользователь не найден" })
        }

        const result = await createTask(creatorId, req.body)

        if (result.ok === false) {
            return res.status(result.statusCode).json({ message: result.message })
        }

        return res.status(201).json({ task: result.task, message: "Задача создана" })
    } catch {
        return res.status(500).json({ message: "Internal server error" })
    }
}

const updateTaskController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId

        if (!userId) {
            return res.status(401).json({ message: "Пользователь не найден" })
        }

        const taskId = Number(req.params.id)

        if (Number.isNaN(taskId)) {
            return res.status(400).json({ message: "Некорректный id задачи" })
        }

        const result = await updateTask(taskId, userId, req.body)

        if (result.ok === false) {
            return res.status(result.statusCode).json({ message: result.message })
        }

        return res.status(200).json({ task: result.task })
    } catch {
        return res.status(500).json({ message: "Internal server error" })
    }
}

const deleteTaskController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId

        if (!userId) {
            return res.status(401).json({ message: "Пользователь не найден" })
        }

        const taskId = Number(req.params.id)

        if (Number.isNaN(taskId)) {
            return res.status(400).json({ message: "Некорректный id задачи" })
        }

        const result = await deleteTask(taskId, userId)

        if (!result.ok) {
            return res.status(result.statusCode).json({ message: result.message })
        }

        return res.status(result.statusCode).json({ message: result.message })
    } catch {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export { getTasksController, createTaskController, updateTaskController, deleteTaskController }
