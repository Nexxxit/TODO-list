type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW'
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'

type TaskResponsible = {
    first_name: string
    last_name: string
    patronymic: string
}

type Task = {
    id: number
    title: string
    description: string
    priority: TaskPriority
    status: TaskStatus
    ending_date: string
    responsible: TaskResponsible
}

type TasksResponse = {
    tasks: Task[]
}

export type { TasksResponse, Task, TaskStatus, TaskPriority }