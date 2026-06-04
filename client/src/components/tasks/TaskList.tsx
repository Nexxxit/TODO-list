import type { Task } from '../../types/task.type'
import { TaskItem } from './TaskItem'

type TaskListProps = {
    tasks: Task[]
    onEdit: (task: Task) => void
    onDelete: (taskId: number) => void
}

const TaskList = ({ tasks, onEdit, onDelete }: TaskListProps) => (
    <ul className="flex flex-col gap-3 [&>li]:animate-slide-up [&>li:nth-child(1)]:[animation-delay:0ms] [&>li:nth-child(2)]:[animation-delay:60ms] [&>li:nth-child(3)]:[animation-delay:120ms] [&>li:nth-child(4)]:[animation-delay:180ms] [&>li:nth-child(5)]:[animation-delay:240ms] [&>li:nth-child(n+6)]:[animation-delay:300ms]">
        {tasks.map(task => (
            <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
    </ul>
)

export { TaskList }
