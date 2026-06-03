import { Navigate } from "react-router"

type Props = { children: React.ReactNode }

const ProtectedRoute = ({ children }: Props) => {
    const token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export { ProtectedRoute }