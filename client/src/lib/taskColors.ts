import type { TaskStatus } from "../types/task.type"

const getTitleColor = (status: TaskStatus, ending_date: string) => {
    const startOfDay = (d: Date) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate())

    const today = startOfDay(new Date())
    const deadline = startOfDay(new Date(ending_date))
    const isOverdue = deadline < today

    if (status === "DONE") {
        return "text-green-600"
    }
    if (isOverdue) {
        return "text-red-600"
    }
    return "text-gray-600"
}

export { getTitleColor }