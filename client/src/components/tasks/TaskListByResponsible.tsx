import { groupByResponsible } from '../../lib/taskGrouping'
import type { Task } from '../../types/task.type'
import { TaskItem } from './TaskItem'

type TaskListByResponsibleProps = {
    tasks: Task[]
    onEdit: (task: Task) => void
    onDelete: (taskId: number) => void
}

const TaskListByResponsible = ({ tasks, onEdit, onDelete }: TaskListByResponsibleProps) => (
    <div className="animate-fade-in flex flex-col gap-8">
        {groupByResponsible(tasks).map(group => (
            <section key={group.key}>
                <h2 className="sticky top-0 z-10 -mx-1 mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 backdrop-blur-xl">
                    <span className="text-lg font-semibold tracking-tight text-gray-200">{group.key}</span>
                    <span className="text-sm font-medium text-purple-300">{group.tasks.length}</span>
                </h2>
                <ul className="flex flex-col gap-3 [&>li]:animate-slide-up [&>li:nth-child(1)]:[animation-delay:0ms] [&>li:nth-child(2)]:[animation-delay:60ms] [&>li:nth-child(3)]:[animation-delay:120ms] [&>li:nth-child(4)]:[animation-delay:180ms] [&>li:nth-child(5)]:[animation-delay:240ms] [&>li:nth-child(n+6)]:[animation-delay:300ms]">
                    {group.tasks.map(task => (
                        <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </ul>
            </section>
        ))}
    </div>
)

export { TaskListByResponsible }
