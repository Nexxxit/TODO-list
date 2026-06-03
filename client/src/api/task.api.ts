import type { Task, TasksResponse } from "../types/task.type";
import { request } from "./client";


const getTasks = async (): Promise<Task[]> => {
    const data = await request<TasksResponse>("/tasks")
    return data.tasks
}

export { getTasks }