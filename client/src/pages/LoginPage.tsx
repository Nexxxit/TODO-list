import { useState, type SubmitEvent } from 'react'
import { LogIn, Lock, Loader2 } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router'

import { authLogin } from '../api/auth.api'
import { Button } from '../shared/Button'
import { Input } from '../shared/Input'
import { getToken, setToken } from '../lib/storage'

const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()

    if (getToken()) return <Navigate to="/" replace />

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const token = await authLogin({ login, password })
            setToken(token)
            navigate('/', { replace: true })
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="animate-fade-in flex min-h-0 flex-1 flex-col items-center justify-center px-4">
            <div className="w-full max-w-md animate-scale-in rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-purple-950/50 backdrop-blur-xl">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-100">Вход в систему</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-300">Логин</span>
                        <div className="relative">
                            <LogIn
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300/70"
                                aria-hidden
                            />
                            <Input
                                type="text"
                                placeholder="Введите логин"
                                value={login}
                                onChange={e => setLogin(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-300">Пароль</span>
                        <div className="relative">
                            <Lock
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300/70"
                                aria-hidden
                            />
                            <Input
                                type="password"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </label>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-300"
                        >
                            {error}
                        </p>
                    )}

                    <Button type="submit" size="md" variant="primary" className="mt-1 w-full" disabled={loading}>
                        {loading ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                                Вход...
                            </span>
                        ) : (
                            'Войти'
                        )}
                    </Button>
                </form>
            </div>
        </section>
    )
}

export { LoginPage }
