import { useState, type SubmitEvent } from "react"
import { Button } from "../shared/Button"
import { getToken, setToken } from "../lib/storage"
import { Navigate, useNavigate } from "react-router"
import { authLogin } from "../api/auth.api"

const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()

    if (getToken()) return <Navigate to="/" replace />

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        if (!login.trim() || !password) {
            setError("Введите логин и пароль")
            return
        }

        try {
            const token = await authLogin({ login, password })
            setToken(token)
            navigate('/')
        } catch (error) {
            setError((error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section>
            <form onSubmit={handleSubmit} className="flex flex-col mx-auto space-y-3 border max-w-md p-4 rounded-lg">
                <label className="flex flex-col gap-1">
                    Логин
                    <input
                        type="text"
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Пароль
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <Button type="submit" size="md" variant="primary" className="w-full" disabled={loading}>
                    {loading ? "Вход..." : "Войти"}
                </Button>
            </form>
        </section>
    )
}

export { LoginPage }