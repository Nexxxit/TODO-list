import { getToken } from './storage'

type SessionUser = {
    userId: number
    login: string
}

const getSessionUser = (): SessionUser | null => {
    const token = getToken()
    if (!token) return null

    try {
        const payload = JSON.parse(atob(token.split('.')[1])) as SessionUser
        if (typeof payload.userId !== 'number' || typeof payload.login !== 'string') {
            return null
        }
        return payload
    } catch {
        return null
    }
}

export type { SessionUser }
export { getSessionUser }
