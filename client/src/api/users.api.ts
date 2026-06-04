import type { SubordinateUser, SubordinatesResponse } from '../types/user.type'
import { request } from './client'

const getSubordinates = async (): Promise<SubordinateUser[]> => {
    const data = await request<SubordinatesResponse>('/users/subordinates')
    return data.subordinates
}

export { getSubordinates }
