import { getToken } from "../lib/storage"

const BASE_URL = import.meta.env.VITE_API_URL ?? ""

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE"
    body?: unknown
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

    const contentType = res.headers.get("content-type") ?? ""
    const isJson = contentType.includes("application/json")

    if (!isJson) {
        const text = await res.text()
        throw new Error(
            res.ok
                ? "Сервер вернул не JSON"
                : `Ошибка сервера (${res.status})${text ? `: ${text.slice(0, 120)}` : ""}`
        )
    }

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message ?? "Ошибка запроса")
    }
    return data as T
}

export { request }