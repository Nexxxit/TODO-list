import { useEffect, useState } from "react"
import { getTasks } from "../api/task.api"
import type { Task } from "../types/task.type"
import { getTitleColor } from "../lib/taskColors"
import { Button } from "../shared/Button"

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const load = async () => {
            setLoading(true)
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


    return (
        <>
            <Button size="sm" variant="secondary">
                Сортировать
            </Button>
            <ul>
                {tasks.map(task => (
                    <li className={getTitleColor(task.status, task.ending_date)} key={task.id}>
                        {task.title}
                    </li>
                ))}
            </ul>
        </>

    )
}

export { TasksPage }