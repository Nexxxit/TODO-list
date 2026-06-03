import { prisma } from "../lib/prisma"
import type { ICreateTask, IUpdateTask } from "../types/task.types"
import type { Prisma } from "../generated/prisma/client"

const taskResponsibleInclude = {
    responsible: {
        select: {
            id: true,
            first_name: true,
            last_name: true,
            patronymic: true,
        },
    },
} as const

const assertResponsibleIsSubordinate = async (directorId: number, responsibleId: number) => {
    const subordinates = await prisma.user.findMany({
        where: { director_id: directorId },
    })

    if (!subordinates.some((u) => u.id === responsibleId)) {
        return {
            ok: false as const,
            statusCode: 403,
            message: "Нельзя назначить ответственным пользователя, который не является вашим подчинённым",
        }
    }

    return { ok: true as const }
}

const getAllTasks = async () => {
    const allTasks = await prisma.task.findMany({
        orderBy: { updated_at: "desc" },
        include: taskResponsibleInclude,
    })
    return { ok: true, statusCode: 200, allTasks }
}

const createTask = async (creator_id: number, { status = "TODO", title, description, ending_date, priority, responsible_id }: ICreateTask) => {
    if (!creator_id || !title || !description || !ending_date || !priority || !responsible_id) {
        return { ok: false, statusCode: 400, message: "Не удалось создать задачу" }
    }

    const subordinateCheck = await assertResponsibleIsSubordinate(creator_id, responsible_id)
    if (!subordinateCheck.ok) {
        return subordinateCheck
    }

    const newTask = await prisma.task.create({
        data: {
            title,
            description,
            priority,
            responsible_id,
            ending_date: new Date(ending_date),
            status,
            creator_id,
        },
        include: taskResponsibleInclude,
    })
    return { ok: true, statusCode: 201, task: newTask }
}

const updateTask = async (taskId: number, userId: number, data: IUpdateTask) => {
    const hasChanges = Object.keys(data).length > 0

    if (!hasChanges) {
        return { ok: false, statusCode: 400, message: "Нет изменений" }
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId },
    })

    if (!task) {
        return { ok: false, statusCode: 404, message: "Задача не найдена" }
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!currentUser) {
        return { ok: false, statusCode: 401, message: "Пользователь не найден" }
    }

    const isBossTaskForSubordinate =
        currentUser.director_id !== null &&
        task.creator_id === currentUser.director_id

    let updateData: Prisma.TaskUpdateInput

    if (isBossTaskForSubordinate) {
        const hasOtherFields =
            data.title !== undefined ||
            data.description !== undefined ||
            data.ending_date !== undefined ||
            data.priority !== undefined ||
            data.responsible_id !== undefined

        if (hasOtherFields) {
            return {
                ok: false,
                statusCode: 403,
                message: "Нельзя изменять задачу руководителя, кроме статуса",
            }
        }

        if (data.status === undefined) {
            return { ok: false, statusCode: 400, message: "Укажите статус для обновления" }
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
            const subordinateCheck = await assertResponsibleIsSubordinate(userId, data.responsible_id)
            if (!subordinateCheck.ok) {
                return subordinateCheck
            }
            updateData.responsible = { connect: { id: data.responsible_id } }
        }
    }

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
        include: taskResponsibleInclude,
    })

    return { ok: true, statusCode: 200, task: updatedTask }
}

const deleteTask = async (taskId: number, userId: number) => {
    const currentUser = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!currentUser) {
        return { ok: false as const, statusCode: 401, message: "Пользователь не найден" }
    }

    if (currentUser.director_id !== null) {
        return { ok: false as const, statusCode: 403, message: "Удалять задачи может только руководитель" }
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId }
    })

    if (!task) {
        return { ok: false as const, statusCode: 404, message: "Задача не найдена" }
    }

    await prisma.task.delete({
        where: { id: taskId }
    })

    return { ok: true as const, statusCode: 200, message: "Задача успешно удалена" }
}

export { getAllTasks, createTask, updateTask, deleteTask }