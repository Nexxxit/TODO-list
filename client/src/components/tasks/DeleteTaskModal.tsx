import { createPortal } from 'react-dom'
import type { Task } from '../../types/task.type'
import { Modal } from '../../shared/Modal'
import { Button } from '../../shared/Button'

type DeleteTaskModalProps = {
    task: Task
    isDeleting: boolean
    error?: string
    onConfirm: () => void
    onClose: () => void
}

const DeleteTaskModal = ({ task, isDeleting, error = '', onConfirm, onClose }: DeleteTaskModalProps) =>
    createPortal(
        <Modal onClose={onClose} modalTitle="Удаление задачи">
            <p className="text-gray-300">
                Вы уверены, что хотите удалить задачу{' '}
                <span className="font-medium text-gray-100">«{task.title}»</span>? Это действие нельзя
                отменить.
            </p>
            {error && (
                <p
                    role="alert"
                    className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
                >
                    {error}
                </p>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
                    Отмена
                </Button>
                <Button
                    variant="secondary"
                    className="border-rose-500/30 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    aria-busy={isDeleting}
                >
                    {isDeleting ? 'Удаление...' : 'Удалить'}
                </Button>
            </div>
        </Modal>,
        document.body
    )

export { DeleteTaskModal }
