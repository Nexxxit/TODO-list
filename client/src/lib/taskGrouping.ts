import type { Task } from "../types/task.type"

type DateBucket = "overdue" | "today" | "week" | "future"

type DateGroups = {
    overdue: Task[]
    today: Task[]
    week: Task[]
    future: Task[]
}

type ResponsibleGroup = {
    key: string
    tasks: Task[]
}

const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate())

const getDateBucket = (ending_date: string): DateBucket => {
    const today = startOfDay(new Date())
    const deadline = startOfDay(new Date(ending_date))

    const diffDays = Math.round(
        (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays < 0) return "overdue"
    if (diffDays === 0) return "today"
    if (diffDays <= 7) return "week"
    return "future"
}

const groupByDate = (tasks: Task[]): DateGroups => {
    const groups: DateGroups = {
        overdue: [],
        today: [],
        week: [],
        future: [],
    }

    for (const task of tasks) {
        const bucket = getDateBucket(task.ending_date)
        groups[bucket].push(task)
    }

    return groups
}

const formatResponsibleName = (task: Task) => {
    const { last_name, first_name, patronymic } = task.responsible
    return `${last_name} ${first_name} ${patronymic}`.trim()
}

const groupByResponsible = (tasks: Task[]): ResponsibleGroup[] => {
    const map = new Map<string, Task[]>()

    for (const task of tasks) {
        const key = formatResponsibleName(task)

        if (!map.has(key)) {
            map.set(key, [])
        }

        map.get(key)!.push(task)
    }

    return Array.from(map, ([key, groupTasks]) => ({
        key,
        tasks: groupTasks,
    }))
}

const isTaskOverdue = (ending_date: string) => getDateBucket(ending_date) === 'overdue'

export { groupByDate, groupByResponsible, formatResponsibleName, isTaskOverdue }
export type { DateGroups, ResponsibleGroup, DateBucket }
