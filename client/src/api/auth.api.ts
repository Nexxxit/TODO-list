import { request } from "./client"

type LoginResponse = {
    token: string
}

type LoginBody = {
    login: string
    password: string
}

const authLogin = async (body: LoginBody): Promise<string> => {
    const data = await request<LoginResponse>("/auth/login", {
        method: "POST",
        body,
    })
    return data.token
}

export { authLogin }
