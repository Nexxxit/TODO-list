import { Button } from '../../shared/Button'
import { GroupingControls } from './GroupingControls'
import type { GroupMode } from './types'

type TasksToolbarProps = {
    group: GroupMode
    onGroupChange: (mode: GroupMode) => void
    onNewTask: () => void
}

const TasksToolbar = ({ group, onGroupChange, onNewTask }: TasksToolbarProps) => (
    <div className="flex flex-col text-center">
        <Button onClick={onNewTask}>Новая задача</Button>
        <GroupingControls group={group} onGroupChange={onGroupChange} />
    </div>
)

export { TasksToolbar }
