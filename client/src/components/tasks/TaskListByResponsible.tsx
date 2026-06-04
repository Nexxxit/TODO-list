import { groupByResponsible } from '../../lib/taskGrouping'
import type { Task } from '../../types/task.type'
import { TaskItem } from './TaskItem'

type TaskListByResponsibleProps = {
    tasks: Task[]
    onEdit: (task: Task) => void
    onDelete: (taskId: number) => void
}

const TaskListByResponsible = ({ tasks, onEdit, onDelete }: TaskListByResponsibleProps) => (
    <>
        {groupByResponsible(tasks).map(group => (
            <div key={group.key}>
                <h2>{group.key}</h2>
                <ul>
                    {group.tasks.map(task => (
                        <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </ul>
            </div>
        ))}
    </>
)

export { TaskListByResponsible }
