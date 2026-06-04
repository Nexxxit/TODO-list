import type { Task } from '../../types/task.type'
import { TaskItem } from './TaskItem'

type TaskListProps = {
    tasks: Task[]
    onEdit: (task: Task) => void
    onDelete: (taskId: number) => void
}

const TaskList = ({ tasks, onEdit, onDelete }: TaskListProps) => (
    <ul>
        {tasks.map(task => (
            <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
    </ul>
)

export { TaskList }
