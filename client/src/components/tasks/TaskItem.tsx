import type { KeyboardEvent } from 'react'
import { Calendar, Trash2, User } from 'lucide-react'
import type { Task, TaskPriority, TaskStatus } from '../../types/task.type'
import { formatResponsibleName } from '../../lib/taskGrouping'
import { Button } from '../../shared/Button'

type TaskItemProps = {
    task: Task
    onEdit: (task: Task) => void
    onDelete: (taskId: number) => void
}

const priorityLabel: Record<TaskPriority, string> = {
    HIGH: 'Высокий',
    MEDIUM: 'Средний',
    LOW: 'Низкий',
}

const statusLabel: Record<TaskStatus, string> = {
    TODO: 'К выполнению',
    IN_PROGRESS: 'В работе',
    DONE: 'Выполнена',
    CANCELLED: 'Отменена',
}

const handleCardKeyDown = (event: KeyboardEvent, onEdit: (task: Task) => void, task: Task) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onEdit(task)
    }
}

const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => (
    <li className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-purple-950/25">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div
                role="button"
                tabIndex={0}
                aria-label={`Редактировать задачу: ${task.title}`}
                title="Нажмите, чтобы редактировать"
                className="min-w-0 flex-1 cursor-pointer space-y-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400/50"
                onClick={() => onEdit(task)}
                onKeyDown={(event) => handleCardKeyDown(event, onEdit, task)}
            >
                <h3
                    className={`text-lg font-semibold leading-snug tracking-tight ${task.status === 'DONE'
                            ? 'text-emerald-400'
                            : new Date(new Date(task.ending_date).toDateString()) <
                                new Date(new Date().toDateString())
                                ? 'text-rose-400'
                                : 'text-slate-300'
                        }`}
                >
                    {task.title}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${task.priority === 'HIGH'
                                ? 'bg-rose-500/20 text-rose-300'
                                : task.priority === 'MEDIUM'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-slate-500/20 text-slate-300'
                            }`}
                    >
                        {priorityLabel[task.priority]}
                    </span>
                    <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${task.status === 'DONE'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : task.status === 'IN_PROGRESS'
                                    ? 'bg-violet-500/20 text-violet-300'
                                    : task.status === 'CANCELLED'
                                        ? 'bg-slate-600/30 text-slate-400'
                                        : 'bg-sky-500/20 text-sky-300'
                            }`}
                    >
                        {statusLabel[task.status]}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-300">
                    <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 shrink-0 text-purple-300/80" aria-hidden />
                        {new Date(task.ending_date).toLocaleDateString('ru-RU')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <User className="h-4 w-4 shrink-0 text-purple-300/80" aria-hidden />
                        {formatResponsibleName(task)}
                    </span>
                </div>
            </div>

            <Button
                size="sm"
                variant="secondary"
                type="button"
                aria-label="Удалить задачу"
                className="flex !h-9 !w-9 shrink-0 !p-0 items-center justify-center self-start border-rose-500/30 bg-rose-500/10 text-rose-200 backdrop-blur-md hover:bg-rose-500/20"
                onClick={() => onDelete(task.id)}
            >
                <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
        </div>
    </li>
)

export { TaskItem }
