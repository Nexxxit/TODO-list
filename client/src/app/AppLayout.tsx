import { Outlet, useLocation } from 'react-router'
import { LogoutButton } from './LogoutButton'
import { getToken } from '../lib/storage'

const AppLayout = () => {
    const { pathname } = useLocation()
    const isLoginPage = pathname === '/login'
    const showLogout = Boolean(getToken()) && !isLoginPage

    return (
        <div className="relative flex h-dvh flex-col overflow-x-hidden bg-linear-to-br from-slate-950 via-slate-900 to-purple-950 text-gray-200">
            <div
                className="pointer-events-none fixed -left-32 top-0 h-96 w-96 animate-blob rounded-full bg-purple-600/20 blur-3xl"
                aria-hidden
            />
            <div
                className="pointer-events-none fixed -right-24 bottom-0 h-80 w-80 animate-blob rounded-full bg-violet-500/15 blur-3xl [animation-delay:2s]"
                aria-hidden
            />

            {!isLoginPage && (
                <header className="relative border-b border-white/10 bg-white/5 px-4 py-4 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-4xl items-center justify-between">
                        <h1 className="text-xl font-semibold tracking-tight text-gray-100">Список задач</h1>
                        {showLogout && <LogoutButton />}
                    </div>
                </header>
            )}

            <main
                className={`scrollbar-hidden relative mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-y-auto px-4 ${isLoginPage ? 'py-0' : 'py-8'}`}
            >
                <Outlet />
            </main>
        </div>
    )
}

export { AppLayout }
