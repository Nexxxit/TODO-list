const getToken = () => {
    const token = localStorage.getItem("token")
    return token
}

const setToken = (token: string) => {
    localStorage.setItem("token", token)
}

const clearToken = () => {
    localStorage.removeItem("token")
}

export { getToken, setToken, clearToken }