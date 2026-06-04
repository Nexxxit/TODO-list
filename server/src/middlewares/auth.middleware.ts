import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: "Токен не передан" })
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Неверный формат" })
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "Сервер не настроен" })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Токен не передан" })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if (typeof payload === "string") {
            return res.status(401).json({ message: "Недействительный токен" })
        }

        req.user = {
            userId: payload.userId,
            login: payload.login,
            directorId: payload.directorId ?? null,
        }

        return next()
    } catch {
        return res.status(401).json({ message: "Недействительный токен" })
    }

}