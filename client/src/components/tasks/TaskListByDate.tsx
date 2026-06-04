import type { DateGroups } from '../../lib/taskGrouping'
import type { Task } from '../../types/task.type'
import { TaskItem } from './TaskItem'

type TaskListByDateProps = {
    dateGroups: DateGroups
    onEdit: (task: Task) => void
    onDelete: (taskId: number) => void
}

const sectionHeaderClass =
    'sticky top-0 z-10 -mx-1 mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 backdrop-blur-xl'

const TaskListByDate = ({ dateGroups, onEdit, onDelete }: TaskListByDateProps) => (
    <div className="animate-fade-in flex flex-col gap-8">
        {dateGroups.overdue.length > 0 && (
            <section>
                <h2 className={sectionHeaderClass}>
                    <span className="text-lg font-semibold tracking-tight text-rose-300">Просрочено</span>
                    <span className="text-sm font-medium text-purple-300">{dateGroups.overdue.length}</span>
                </h2>
                <ul className="flex flex-col gap-3 [&>li]:animate-slide-up [&>li:nth-child(1)]:[animation-delay:0ms] [&>li:nth-child(2)]:[animation-delay:60ms] [&>li:nth-child(3)]:[animation-delay:120ms] [&>li:nth-child(4)]:[animation-delay:180ms] [&>li:nth-child(5)]:[animation-delay:240ms] [&>li:nth-child(n+6)]:[animation-delay:300ms]">
                    {dateGroups.overdue.map(task => (
                        <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </ul>
            </section>
        )}

        <section>
            <h2 className={sectionHeaderClass}>
                <span className="text-lg font-semibold tracking-tight text-gray-200">На сегодня</span>
                <span className="text-sm font-medium text-purple-300">{dateGroups.today.length}</span>
            </h2>
            <ul className="flex flex-col gap-3 [&>li]:animate-slide-up [&>li:nth-child(1)]:[animation-delay:0ms] [&>li:nth-child(2)]:[animation-delay:60ms] [&>li:nth-child(3)]:[animation-delay:120ms] [&>li:nth-child(4)]:[animation-delay:180ms] [&>li:nth-child(5)]:[animation-delay:240ms] [&>li:nth-child(n+6)]:[animation-delay:300ms]">
                {dateGroups.today.map(task => (
                    <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </ul>
        </section>

        <section>
            <h2 className={sectionHeaderClass}>
                <span className="text-lg font-semibold tracking-tight text-gray-200">На неделе</span>
                <span className="text-sm font-medium text-purple-300">{dateGroups.week.length}</span>
            </h2>
            <ul className="flex flex-col gap-3 [&>li]:animate-slide-up [&>li:nth-child(1)]:[animation-delay:0ms] [&>li:nth-child(2)]:[animation-delay:60ms] [&>li:nth-child(3)]:[animation-delay:120ms] [&>li:nth-child(4)]:[animation-delay:180ms] [&>li:nth-child(5)]:[animation-delay:240ms] [&>li:nth-child(n+6)]:[animation-delay:300ms]">
                {dateGroups.week.map(task => (
                    <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </ul>
        </section>

        <section>
            <h2 className={sectionHeaderClass}>
                <span className="text-lg font-semibold tracking-tight text-gray-200">На будущее</span>
                <span className="text-sm font-medium text-purple-300">{dateGroups.future.length}</span>
            </h2>
            <ul className="flex flex-col gap-3 [&>li]:animate-slide-up [&>li:nth-child(1)]:[animation-delay:0ms] [&>li:nth-child(2)]:[animation-delay:60ms] [&>li:nth-child(3)]:[animation-delay:120ms] [&>li:nth-child(4)]:[animation-delay:180ms] [&>li:nth-child(5)]:[animation-delay:240ms] [&>li:nth-child(n+6)]:[animation-delay:300ms]">
                {dateGroups.future.map(task => (
                    <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </ul>
        </section>
    </div>
)

export { TaskListByDate }
