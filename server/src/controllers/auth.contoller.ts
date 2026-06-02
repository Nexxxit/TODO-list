import type { Request, Response } from "express";
import { authLogin } from "../services/auth.service"

const loginController = async (req: Request, res: Response) => {
    try {
        const { login, password } = req.body

        const result = await authLogin({ login, password })

        if (result.ok === false) {
            return res.status(result.statusCode).json({ message: result.message })
        }

        return res.status(200).json({ token: result.token })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export { loginController }