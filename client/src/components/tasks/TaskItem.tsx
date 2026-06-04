import type { Task } from '../../types/task.type'
import { getTitleColor } from '../../lib/taskColors'
import { formatResponsibleName } from '../../lib/taskGrouping'
import { Button } from '../../shared/Button'

type TaskItemProps = {
    task: Task
    onEdit: (task: Task) => void
    onDelete: (taskId: number) => void
}

const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => (
    <li className={`flex flex-col ${getTitleColor(task.status, task.ending_date)}`}>
        <strong>{task.title}</strong>
        {task.priority}
        {new Date(task.ending_date).toLocaleDateString('ru-RU')}
        {formatResponsibleName(task)}
        {task.status}
        <Button onClick={() => onEdit(task)}>Редактировать</Button>
        <Button onClick={() => onDelete(task.id)}>Удалить</Button>
    </li>
)

export { TaskItem }
