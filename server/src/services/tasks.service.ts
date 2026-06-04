import { prisma } from "../lib/prisma"
import type { ICreateTask, IUpdateTask } from "../types/task.types"
import type { Prisma } from "@prisma/client"

const responsibleSelect = {
    id: true,
    first_name: true,
    last_name: true,
    patronymic: true,
} as const

type Responsible = Prisma.UserGetPayload<{ select: typeof responsibleSelect }>

const taskListInclude = {
    responsible: { select: responsibleSelect },
} as const

const findSubordinate = (directorId: number, responsibleId: number) =>
    prisma.user.findFirst({
        where: { id: responsibleId, director_id: directorId },
        select: responsibleSelect,
    })

const withResponsible = <T extends { responsible_id: number }>(
    task: T,
    responsible: Responsible
) => ({ ...task, responsible })

const getAllTasks = async () => {
    const allTasks = await prisma.task.findMany({
        orderBy: { updated_at: "desc" },
        include: taskListInclude,
    })
    return { ok: true as const, statusCode: 200, allTasks }
}

const createTask = async (
    creator_id: number,
    { status = "TODO", title, description, ending_date, priority, responsible_id }: ICreateTask
) => {
    if (!creator_id || !title || !description || !ending_date || !priority || !responsible_id) {
        return { ok: false as const, statusCode: 400, message: "Не удалось создать задачу" }
    }

    const responsible = await findSubordinate(creator_id, responsible_id)
    if (!responsible) {
        return {
            ok: false as const,
            statusCode: 403,
            message: "Нельзя назначить ответственным пользователя, который не является вашим подчинённым",
        }
    }

    const created = await prisma.task.create({
        data: {
            title,
            description,
            priority,
            responsible_id,
            ending_date: new Date(ending_date),
            status,
            creator_id,
        },
    })

    return { ok: true as const, statusCode: 201, task: withResponsible(created, responsible) }
}

const updateTask = async (
    taskId: number,
    userId: number,
    directorId: number | null,
    data: IUpdateTask
) => {
    if (Object.keys(data).length === 0) {
        return { ok: false as const, statusCode: 400, message: "Нет изменений" }
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task) {
        return { ok: false as const, statusCode: 404, message: "Задача не найдена" }
    }

    const isBossTaskForSubordinate = directorId !== null && task.creator_id === directorId
    let updateData: Prisma.TaskUncheckedUpdateInput
    let responsible: Responsible | null = null

    if (isBossTaskForSubordinate) {
        const hasOtherFields =
            data.title !== undefined ||
            data.description !== undefined ||
            data.ending_date !== undefined ||
            data.priority !== undefined ||
            data.responsible_id !== undefined

        if (hasOtherFields) {
            return {
                ok: false as const,
                statusCode: 403,
                message: "Нельзя изменять задачу руководителя, кроме статуса",
            }
        }

        if (data.status === undefined) {
            return { ok: false as const, statusCode: 400, message: "Укажите статус для обновления" }
        }

        updateData = { status: data.status }
    } else {
        updateData = {}

        const simpleFields = ["title", "description", "priority", "status"] as const
        for (const key of simpleFields) {
            if (data[key] !== undefined) {
                updateData[key] = data[key]
            }
        }

        if (data.ending_date !== undefined) {
            updateData.ending_date = new Date(data.ending_date)
        }

        if (data.responsible_id !== undefined) {
            responsible = await findSubordinate(userId, data.responsible_id)
            if (!responsible) {
                return {
                    ok: false as const,
                    statusCode: 403,
                    message:
                        "Нельзя назначить ответственным пользователя, который не является вашим подчинённым",
                }
            }
            updateData.responsible_id = data.responsible_id
        }
    }

    const updated = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
    })

    if (!responsible) {
        responsible = await prisma.user.findFirst({
            where: { id: updated.responsible_id },
            select: responsibleSelect,
        })
    }

    if (!responsible) {
        return { ok: false as const, statusCode: 500, message: "Не удалось загрузить ответственного" }
    }

    return { ok: true as const, statusCode: 200, task: withResponsible(updated, responsible) }
}

const deleteTask = async (taskId: number, isDirector: boolean) => {
    if (!isDirector) {
        return { ok: false as const, statusCode: 403, message: "Удалять задачи может только руководитель" }
    }

    const deleted = await prisma.task.deleteMany({ where: { id: taskId } })

    if (deleted.count === 0) {
        return { ok: false as const, statusCode: 404, message: "Задача не найдена" }
    }

    return { ok: true as const, statusCode: 200, message: "Задача успешно удалена" }
}

export { getAllTasks, createTask, updateTask, deleteTask }
