import type { TaskMutationResponse, Task, TasksResponse, CreateTaskBody, UpdateTaskBody, DeleteTaskResponse } from "../types/task.type";
import { request } from "./client";


const getTasks = async (): Promise<Task[]> => {
    const data = await request<TasksResponse>("/tasks")
    return data.tasks
}

const createTask = async (taskData: CreateTaskBody): Promise<Task> => {
    const data = await request<TaskMutationResponse>("/tasks", {
        method: "POST",
        body: taskData,
    })

    return data.task
}

const updateTask = async (taskId: number, body: UpdateTaskBody): Promise<Task> => {
    const data = await request<TaskMutationResponse>(`/tasks/${taskId}`, {
        method: "PATCH",
        body,
    })

    return data.task
}

const deleteTask = async (taskId: number): Promise<string> => {
    const data = await request<DeleteTaskResponse>(`/tasks/${taskId}`, {
        method: "DELETE"
    })

    return data.message
}

export { getTasks, createTask, updateTask, deleteTask }