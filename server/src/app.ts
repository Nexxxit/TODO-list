import express from "express"
import cors from "cors"
import { getPrisma } from "./lib/prisma"
import authRouter from "./routes/auth.routes"
import tasksRouter from "./routes/tasks.routes"
import usersRouter from "./routes/users.routes"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => {
    res.send({ ok: true })
})

app.get("/db-check", async (_req, res) => {
    try {
        const usersCount = await getPrisma().user.count()
        res.send({ ok: true, usersCount })
    } catch (e) {
        res.send({ ok: false, message: `DB check failed: ${e}` })
    }
})

app.use("/auth", authRouter)
app.use("/tasks", tasksRouter)
app.use("/users", usersRouter)

export default app
