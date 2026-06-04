import type { CorsOptions } from "cors"

const parseOrigins = (value: string | undefined): string[] =>
    value
        ?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) ?? []

export const buildCorsOptions = (): CorsOptions => {
    const allowedOrigins = parseOrigins(process.env.CORS_ORIGINS)

    if (allowedOrigins.length === 0) {
        return {}
    }

    return {
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
                return
            }
            callback(null, false)
        },
        credentials: true,
    }
}
