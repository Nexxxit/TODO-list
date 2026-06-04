import { Navigate, Outlet } from 'react-router'
import { getToken } from '../lib/storage'

const ProtectedRoute = () => {
    if (!getToken()) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export { ProtectedRoute }
