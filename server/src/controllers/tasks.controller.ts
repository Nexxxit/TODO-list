import type { Request, Response } from "express"
import { createTask, deleteTask, getAllTasks, updateTask } from "../services/tasks.service"

const getTasksController = async (_req: Request, res: Response) => {
    try {
        const result = await getAllTasks()
        return res.status(200).json({ tasks: result.allTasks })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: "Не удалось загрузить задачи" })
    }
}

const createTaskController = async (req: Request, res: Response) => {
    const creatorId = req.user?.userId
    if (!creatorId) {
        return res.status(401).json({ message: "Пользователь не найден" })
    }

    try {
        const result = await createTask(creatorId, req.body)
        if (!result.ok) {
            return res.status(result.statusCode).json({ message: result.message })
        }

        return res.status(201).json({ task: result.task, message: "Задача создана" })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: "Не удалось создать задачу" })
    }
}

const updateTaskController = async (req: Request, res: Response) => {
    const user = req.user
    if (!user) {
        return res.status(401).json({ message: "Пользователь не найден" })
    }

    const taskId = Number(req.params.id)
    if (Number.isNaN(taskId)) {
        return res.status(400).json({ message: "Некорректный id задачи" })
    }

    try {
        const result = await updateTask(taskId, user.userId, user.directorId, req.body)
        if (!result.ok) {
            return res.status(result.statusCode).json({ message: result.message })
        }

        return res.status(200).json({ task: result.task })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: "Не удалось обновить задачу" })
    }
}

const deleteTaskController = async (req: Request, res: Response) => {
    const user = req.user
    if (!user) {
        return res.status(401).json({ message: "Пользователь не найден" })
    }

    const taskId = Number(req.params.id)
    if (Number.isNaN(taskId)) {
        return res.status(400).json({ message: "Некорректный id задачи" })
    }

    try {
        const result = await deleteTask(taskId, user.directorId === null)
        if (!result.ok) {
            return res.status(result.statusCode).json({ message: result.message })
        }

        return res.status(200).json({ message: result.message })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: "Не удалось удалить задачу" })
    }
}

export { getTasksController, createTaskController, updateTaskController, deleteTaskController }
