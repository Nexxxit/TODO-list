import { formatResponsibleName } from './taskGrouping'
import type { Task } from '../types/task.type'

type ResponsibleOption = {
    id: number
    label: string
}

const getResponsibleOptionsFromTasks = (tasks: Task[]): ResponsibleOption[] => {
    const map = new Map<number, string>()

    for (const task of tasks) {
        const { id } = task.responsible
        if (!map.has(id)) {
            map.set(id, formatResponsibleName(task))
        }
    }

    return Array.from(map, ([id, label]) => ({ id, label }))
}

export type { ResponsibleOption }
export { getResponsibleOptionsFromTasks }
