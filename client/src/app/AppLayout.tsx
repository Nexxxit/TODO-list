import { Outlet, useLocation } from 'react-router'
import { LogoutButton } from './LogoutButton'
import { getToken } from '../lib/storage'

const AppLayout = () => {
    const { pathname } = useLocation()
    const showLogout = Boolean(getToken()) && pathname !== '/login'

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                <h1 className="text-lg font-semibold">Список задач</h1>
                {showLogout && <LogoutButton />}
            </header>
            <main className="mx-auto w-full max-w-4xl p-4">
                <Outlet />
            </main>
        </div>
    )
}

export { AppLayout }
