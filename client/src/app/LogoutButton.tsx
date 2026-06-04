import { useNavigate } from 'react-router'
import { LogOut } from 'lucide-react'
import { Button } from '../shared/Button'
import { clearToken } from '../lib/storage'

const LogoutButton = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        clearToken()
        navigate('/login', { replace: true })
    }

    return (
        <Button
            type="button"
            variant="secondary"
            size="sm"
            className="inline-flex items-center gap-1.5"
            onClick={handleLogout}
        >
            <LogOut className="h-4 w-4" aria-hidden />
            Выйти
        </Button>
    )
}

export { LogoutButton }
