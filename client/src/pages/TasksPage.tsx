import { useEffect, useState } from "react"
import { deleteTask, getTasks } from "../api/task.api"
import type { Task } from "../types/task.type"
import { getTitleColor } from "../lib/taskColors"
import { formatResponsibleName, groupByDate, groupByResponsible } from "../lib/taskGrouping"
import { createPortal } from "react-dom"
import { Modal } from "../shared/Modal"
import { Button } from "../shared/Button"

type GroupMode = 'date' | 'responsible' | 'none'

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [group, setGroup] = useState<GroupMode>('none')
    const [showModal, setShowModal] = useState(false)
    const [isEditMode, setEditMode] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

    useEffect(() => {
        const load = async () => {
            setError('')

            try {
                const data = await getTasks()
                setTasks(data)
            } catch (e) {
                setError((e as Error).message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) return <p>Загрузка...</p>
    if (error) return <p className="text-red-600">{error}</p>

    const TaskItem = ({ task }: { task: Task }) => (
        <li className={`flex flex-col ${getTitleColor(task.status, task.ending_date)}`}>
            <strong>{task.title}</strong>
            {task.priority}
            {new Date(task.ending_date).toLocaleDateString('ru-RU')}
            {formatResponsibleName(task)}
            {task.status}
            <Button onClick={() => handleEditTask(task)}>
                Редактировать
            </Button>
            <Button onClick={() => handleDeleteTask(task.id)}>
                Удалить
            </Button>
        </li>
    )

    const dateGroups = groupByDate(tasks)

    const handleEditTask = (task: Task) => {
        setSelectedTask(task)
        setEditMode(true)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setSelectedTask(null)
        setShowModal(false)
        setEditMode(false)
    }

    const handleDeleteTask = (taskId: number) => {
        deleteTask(taskId)
    }

    return (
        <>
            <div className="flex flex-col text-center">
                <Button onClick={() => setShowModal(true)}>
                    Новая задача
                </Button>
                <label htmlFor={"dateGroup"}>По дате завершения</label>
                <input
                    type="radio"
                    name="groups"
                    id="dateGroup"
                    value={"dateGroup"}
                    checked={group === "date"}
                    onChange={() => setGroup("date")}
                />

                <label htmlFor={"responsibleGroup"}>По ответственным</label>
                <input
                    type="radio"
                    name="groups"
                    id="responsibleGroup"
                    value={"responsibleGroup"}
                    checked={group === "responsible"}
                    onChange={() => setGroup("responsible")}
                />

                <label htmlFor={"noneGroup"}>Без группировки</label>
                <input
                    type="radio"
                    name="groups"
                    id="noneGroup"
                    value={"noneGroup"}
                    checked={group === "none"}
                    onChange={() => setGroup("none")}
                />
            </div>

            {group === "none" && (
                <ul>
                    {tasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </ul>
            )}

            {group === "date" && (
                <>
                    {dateGroups.overdue.length > 0 && (
                        <>
                            <h2>Просрочено</h2>
                            <ul>
                                {dateGroups.overdue.map(task => (
                                    <TaskItem key={task.id} task={task} />
                                ))}
                            </ul>
                        </>
                    )}
                    <h2>На сегодня</h2>
                    <ul>{
                        dateGroups.today.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </ul>
                    <h2>На неделю</h2>
                    <ul>{
                        dateGroups.week.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </ul>
                    <h2>На будущее</h2>
                    <ul>{
                        dateGroups.future.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                    </ul>
                </>
            )}

            {group === "responsible" && (
                groupByResponsible(tasks).map(group => (
                    <div key={group.key}>
                        <h2>{group.key}</h2>
                        <ul>
                            {group.tasks.map(task => (
                                <TaskItem key={task.id} task={task} />
                            ))}
                        </ul>
                    </div>
                ))
            )}

            {showModal && createPortal(
                <Modal onClose={handleCloseModal} modalTitle={isEditMode ? "Редактирование задачи" : "Создание задачи"}>
                    <div>
                        Форма
                    </div>
                </Modal>,
                document.body
            )}
        </>
    )
}

export { TasksPage }