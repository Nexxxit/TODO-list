type SubordinateUser = {
    id: number
    first_name: string
    last_name: string
    patronymic: string | null
}

type SubordinatesResponse = {
    subordinates: SubordinateUser[]
}

export type { SubordinateUser, SubordinatesResponse }
