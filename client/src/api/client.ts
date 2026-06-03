import { getToken } from "../lib/storage"

const BASE_URL = "http://localhost:3001"

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE"
    body?: unknown
    auth?: boolean
}

const request = async <T>(path: string, options?: RequestOptions): Promise<T> => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    }

    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        method: options?.method ?? "GET",
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message ?? "Ошибка запроса")
    }
    return data as T
}

export { request }