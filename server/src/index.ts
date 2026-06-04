import app from "./app"

const port = Number(process.env.PORT) || 3001
const host = process.env.HOST ?? "0.0.0.0"

app.listen(port, host, () => {
    console.log(`Сервер запущен на http://${host}:${port}`)
})
