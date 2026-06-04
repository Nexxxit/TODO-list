import type { DateGroups } from '../../lib/taskGrouping'
import type { Task } from '../../types/task.type'
import { TaskItem } from './TaskItem'

type TaskListByDateProps = {
    dateGroups: DateGroups
    onEdit: (task: Task) => void
    onDelete: (taskId: number) => void
}

const TaskListByDate = ({ dateGroups, onEdit, onDelete }: TaskListByDateProps) => (
    <>
        {dateGroups.overdue.length > 0 && (
            <>
                <h2>Просрочено</h2>
                <ul>
                    {dateGroups.overdue.map(task => (
                        <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </ul>
            </>
        )}
        <h2>На сегодня</h2>
        <ul>
            {dateGroups.today.map(task => (
                <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </ul>
        <h2>На неделю</h2>
        <ul>
            {dateGroups.week.map(task => (
                <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </ul>
        <h2>На будущее</h2>
        <ul>
            {dateGroups.future.map(task => (
                <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </ul>
    </>
)

export { TaskListByDate }
