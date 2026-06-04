import type { Request, Response } from "express"
import { getSubordinates } from "../services/users.service"

const getSubordinatesController = async (req: Request, res: Response) => {
    const userId = req.user?.userId

    if (!userId) {
        return res.status(401).json({ message: "Не авторизован" })
    }

    const result = await getSubordinates(userId)

    return res.status(result.statusCode).json({ subordinates: result.subordinates })
}

export { getSubordinatesController }
