import { getToken } from './storage'

type SessionUser = {
    userId: number
    login: string
    directorId: number | null
}

const getSessionUser = (): SessionUser | null => {
    const token = getToken()
    if (!token) return null

    try {
        const payload = JSON.parse(atob(token.split('.')[1])) as {
            userId: number
            login: string
            directorId?: number | null
        }
        if (typeof payload.userId !== 'number' || typeof payload.login !== 'string') {
            return null
        }
        const directorId =
            payload.directorId === null || typeof payload.directorId === 'number'
                ? payload.directorId ?? null
                : null
        return { userId: payload.userId, login: payload.login, directorId }
    } catch {
        return null
    }
}

export type { SessionUser }
export { getSessionUser }
