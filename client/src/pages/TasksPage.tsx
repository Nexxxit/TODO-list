import { useCallback, useEffect, useState } from 'react'
import { deleteTask, getTasks } from '../api/task.api'
import {
    TaskList,
    TaskListByDate,
    TaskListByResponsible,
    TaskModal,
    TasksToolbar,
    type GroupMode,
} from '../components/tasks'
import { groupByDate } from '../lib/taskGrouping'
import { getResponsibleOptionsFromTasks } from '../lib/responsibleOptions'
import type { Task } from '../types/task.type'

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [group, setGroup] = useState<GroupMode>('none')
    const [showModal, setShowModal] = useState(false)
    const [isEditMode, setEditMode] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    const reloadTasks = useCallback(async () => {
        const data = await getTasks()
        setTasks(data)
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

    const handleDeleteTask = async (taskId: number) => {
        try {
            await deleteTask(taskId)
            await reloadTasks()
        } catch (e) {
            setError((e as Error).message)
        }
    }

    const handleTaskSaved = async () => {
        await reloadTasks()
        handleCloseModal()
    }

    if (loading) return <p>Загрузка...</p>
    if (error) return <p className="text-red-600">{error}</p>

    const dateGroups = groupByDate(tasks)
    const responsibleOptions = getResponsibleOptionsFromTasks(tasks)

    return (
        <>
            <TasksToolbar
                group={group}
                onGroupChange={setGroup}
                onNewTask={handleNewTask}
            />

            {group === 'none' && (
                <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
            )}

            {group === 'date' && (
                <TaskListByDate
                    dateGroups={dateGroups}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                />
            )}

            {group === 'responsible' && (
                <TaskListByResponsible
                    tasks={tasks}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
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
        </>
    )
}

export { TasksPage }
