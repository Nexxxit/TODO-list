import { formatResponsibleName } from './taskGrouping'
import type { SubordinateUser } from '../types/user.type'
import type { Task } from '../types/task.type'

type ResponsibleOption = {
    id: number
    label: string
}

const formatUserName = (user: {
    last_name: string
    first_name: string
    patronymic: string | null
}) => `${user.last_name} ${user.first_name} ${user.patronymic ?? ''}`.trim()

const buildResponsibleOptions = (
    subordinates: SubordinateUser[],
    tasks: Task[],
    editingTask: Task | null
): ResponsibleOption[] => {
    const map = new Map<number, string>()

    for (const user of subordinates) {
        map.set(user.id, formatUserName(user))
    }

    if (editingTask && !map.has(editingTask.responsible_id)) {
        map.set(editingTask.responsible_id, formatResponsibleName(editingTask))
    }

    for (const task of tasks) {
        const { id } = task.responsible
        if (!map.has(id)) {
            map.set(id, formatResponsibleName(task))
        }
    }

    return Array.from(map, ([id, label]) => ({ id, label }))
}

export type { ResponsibleOption }
export { buildResponsibleOptions }
