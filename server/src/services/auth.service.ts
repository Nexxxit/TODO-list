import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';
import { prisma } from "../lib/prisma"
import type { IAuthData } from "../types/auth.types";

export async function authLogin({ login, password }: IAuthData) {

    if (!login || !password) {
        return { ok: false, statusCode: 400, message: "Поля логин и пароль обязательны" }
    }

    if (!process.env.JWT_SECRET) {
        return { ok: false, statusCode: 500, message: "Сервер не настроен" }
    }

    const user = await prisma.user.findUnique({ where: { login } })

    if (!user) {
        return { ok: false, statusCode: 401, message: "Пользователя с таким логином не существует" }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return { ok: false, statusCode: 401, message: "Пользователь ввел неверный пароль" }
    }

    const token = jwt.sign({ userId: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '1d' })

    return { ok: true, statusCode: 200, token }

}