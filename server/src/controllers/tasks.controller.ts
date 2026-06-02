import type { Request, Response } from "express"

const getTasksController = (req: Request, res: Response) => {
    return res.status(200).json([])
}

export { getTasksController }