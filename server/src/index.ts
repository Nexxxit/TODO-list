import express from "express"
import cors from "cors"

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
    res.send({ ok: true })
})

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`)
})
