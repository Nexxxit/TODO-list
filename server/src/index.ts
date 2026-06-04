import express from "express"
import cors from "cors"
import { prisma } from "./lib/prisma"
import authRouter from "./routes/auth.routes"
import tasksRouter from "./routes/tasks.routes"
import usersRouter from "./routes/users.routes"

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
    res.send({ ok: true })
})

app.get('/db-check', async (req, res) => {
    try {
        const usersCount = await prisma.user.count();
        res.send({ ok: true, usersCount })
    } catch (e) {
        res.send({ ok: false, message: `DB check failed: ${e}` })
    }
})

app.use("/auth", authRouter)

app.use("/tasks", tasksRouter)
app.use("/users", usersRouter)

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`)
})
