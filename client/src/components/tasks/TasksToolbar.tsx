import { Plus } from 'lucide-react'
import { Button } from '../../shared/Button'
import { GroupingControls } from './GroupingControls'
import type { GroupMode } from './types'

type TasksToolbarProps = {
    group: GroupMode
    onGroupChange: (mode: GroupMode) => void
    onNewTask: () => void
}

const TasksToolbar = ({ group, onGroupChange, onNewTask }: TasksToolbarProps) => (
    <div className="mb-8 animate-fade-in space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-100">Задачи</h2>
            </div>
            <Button
                onClick={onNewTask}
                className="inline-flex items-center gap-2 border border-white/20 bg-purple-500/40 px-5 py-2.5 font-semibold text-white shadow-lg shadow-purple-900/20 backdrop-blur-md transition-colors hover:bg-purple-500/60 focus-visible:outline-white/30"
            >
                <Plus className="h-5 w-5" aria-hidden />
                Новая задача
            </Button>
        </div>
        <GroupingControls group={group} onGroupChange={onGroupChange} />
    </div>
)

export { TasksToolbar }
