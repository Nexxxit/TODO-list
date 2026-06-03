type TaskPriority = "LOW" | "MEDIUM" | "HIGH"
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED"

interface ICreateTask {
    title: string,
    description: string,
    ending_date: Date,
    priority: TaskPriority,
    status?: TaskStatus,
    responsible_id: number,
}

type IUpdateTask = Partial<Pick<ICreateTask, "title" | "description" | "ending_date" | "priority" | "status" | "responsible_id">>

export type { ICreateTask, IUpdateTask, TaskPriority, TaskStatus }