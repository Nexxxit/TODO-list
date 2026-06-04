import { useCallback, useEffect, useState } from 'react'
import { deleteTask, getTasks } from '../api/task.api'
import { getSubordinates } from '../api/users.api'
import type { SubordinateUser } from '../types/user.type'
import {
    TaskList,
    TaskListByDate,
    TaskListByResponsible,
    DeleteTaskModal,
    TaskModal,
    TasksToolbar,
    type GroupMode,
} from '../components/tasks'
import { groupByDate } from '../lib/taskGrouping'
import { buildResponsibleOptions } from '../lib/responsibleOptions'
import type { Task } from '../types/task.type'

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [subordinates, setSubordinates] = useState<SubordinateUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [group, setGroup] = useState<GroupMode>('none')
    const [showModal, setShowModal] = useState(false)
    const [isEditMode, setEditMode] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState('')

    const reloadTasks = useCallback(async () => {
        const [tasksData, subordinatesData] = await Promise.all([
            getTasks(),
            getSubordinates(),
        ])
        setTasks(tasksData)
        setSubordinates(subordinatesData)
    }, [])

    useEffect(() => {
        const load = async () => {
            setError('')

            try {
                await reloadTasks()
            } catch (e) {
                setError((e as Error).message)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [reloadTasks])

    const handleEditTask = (task: Task) => {
        setSelectedTask(task)
        setEditMode(true)
        setShowModal(true)
    }

    const handleNewTask = () => {
        setSelectedTask(null)
        setEditMode(false)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setSelectedTask(null)
        setShowModal(false)
        setEditMode(false)
    }

    const handleRequestDelete = (taskId: number) => {
        const task = tasks.find((item) => item.id === taskId)
        if (!task) {
            return
        }

        if (showModal) {
            handleCloseModal()
        }

        setDeleteError('')
        setTaskToDelete(task)
    }

    const handleCloseDeleteModal = () => {
        if (isDeleting) {
            return
        }
        setDeleteError('')
        setTaskToDelete(null)
    }

    const handleConfirmDelete = async () => {
        if (!taskToDelete || isDeleting) {
            return
        }

        setIsDeleting(true)
        setDeleteError('')

        try {
            await deleteTask(taskToDelete.id)
            await reloadTasks()
            setTaskToDelete(null)
        } catch (e) {
            setDeleteError((e as Error).message)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleTaskSaved = async () => {
        await reloadTasks()
        handleCloseModal()
    }

    if (loading) {
        return (
            <p className="animate-pulse rounded-xl border border-white/10 bg-white/5 px-6 py-8 text-center text-gray-300 backdrop-blur-lg">
                Загрузка...
            </p>
        )
    }

    if (error) {
        return (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-center text-sm text-rose-300 backdrop-blur-lg">
                {error}
            </p>
        )
    }

    const dateGroups = groupByDate(tasks)
    const responsibleOptions = buildResponsibleOptions(
        subordinates,
        tasks,
        isEditMode ? selectedTask : null
    )

    return (
        <div key={group} className="animate-fade-in space-y-8">
            <TasksToolbar
                group={group}
                onGroupChange={setGroup}
                onNewTask={handleNewTask}
            />

            {group === 'none' && (
                <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleRequestDelete} />
            )}

            {group === 'date' && (
                <TaskListByDate
                    dateGroups={dateGroups}
                    onEdit={handleEditTask}
                    onDelete={handleRequestDelete}
                />
            )}

            {group === 'responsible' && (
                <TaskListByResponsible
                    tasks={tasks}
                    onEdit={handleEditTask}
                    onDelete={handleRequestDelete}
                />
            )}

            {showModal && (
                <TaskModal
                    isEditMode={isEditMode}
                    selectedTask={selectedTask}
                    responsibleOptions={responsibleOptions}
                    onSuccess={handleTaskSaved}
                    onClose={handleCloseModal}
                />
            )}

            {taskToDelete && (
                <DeleteTaskModal
                    task={taskToDelete}
                    isDeleting={isDeleting}
                    error={deleteError}
                    onConfirm={handleConfirmDelete}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </div>
    )
}

export { TasksPage }

