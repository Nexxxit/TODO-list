import { useNavigate } from 'react-router'
import { Button } from '../shared/Button'
import { clearToken } from '../lib/storage'

const LogoutButton = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        clearToken()
        navigate('/login', { replace: true })
    }

    return (
        <Button type="button" variant="secondary" size="sm" onClick={handleLogout}>
            Выйти
        </Button>
    )
}

export { LogoutButton }
