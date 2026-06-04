import { createPortal } from 'react-dom'
import type { ResponsibleOption } from '../../lib/responsibleOptions'
import type { Task } from '../../types/task.type'
import { Modal } from '../../shared/Modal'
import { TaskForm } from './TaskForm'

type TaskModalProps = {
    isEditMode: boolean
    selectedTask: Task | null
    responsibleOptions: ResponsibleOption[]
    onSuccess: () => void
    onClose: () => void
}

const TaskModal = ({
    isEditMode,
    selectedTask,
    responsibleOptions,
    onSuccess,
    onClose,
}: TaskModalProps) =>
    createPortal(
        <Modal
            onClose={onClose}
            modalTitle={isEditMode ? 'Редактирование задачи' : 'Создание задачи'}
        >
            <TaskForm
                key={isEditMode && selectedTask ? `edit-${selectedTask.id}` : 'create'}
                task={selectedTask}
                isEditMode={isEditMode}
                responsibleOptions={responsibleOptions}
                onSuccess={onSuccess}
                onClose={onClose}
            />
        </Modal>,
        document.body
    )

export { TaskModal }
