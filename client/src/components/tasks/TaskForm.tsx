import { useState, type SubmitEvent } from 'react'
import { createTask, updateTask } from '../../api/task.api'
import { getSessionUser } from '../../lib/authSession'
import type { ResponsibleOption } from '../../lib/responsibleOptions'
import { Button } from '../../shared/Button'
import { Input } from '../../shared/Input'
import type { Task, TaskPriority, TaskStatus } from '../../types/task.type'

type TaskFormProps = {
    task: Task | null
    isEditMode: boolean
    responsibleOptions: ResponsibleOption[]
    onSuccess: () => void
    onClose: () => void
}

type FormState = {
    title: string
    description: string
    ending_date: string
    priority: TaskPriority
    status: TaskStatus
    responsible_id: string
}

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
    { value: 'HIGH', label: 'Высокий' },
    { value: 'MEDIUM', label: 'Средний' },
    { value: 'LOW', label: 'Низкий' },
]

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
    { value: 'TODO', label: 'К выполнению' },
    { value: 'IN_PROGRESS', label: 'В работе' },
    { value: 'DONE', label: 'Выполнена' },
    { value: 'CANCELLED', label: 'Отменена' },
]

const toDateInputValue = (iso: string) => iso.slice(0, 10)

const todayInputValue = () => toDateInputValue(new Date().toISOString())

const buildInitialState = (
    task: Task | null,
    isEditMode: boolean,
    defaultResponsibleId: number | undefined
): FormState => {
    if (isEditMode && task) {
        return {
            title: task.title,
            description: task.description,
            ending_date: toDateInputValue(task.ending_date),
            priority: task.priority,
            status: task.status,
            responsible_id: String(task.responsible_id),
        }
    }

    return {
        title: '',
        description: '',
        ending_date: todayInputValue(),
        priority: 'MEDIUM',
        status: 'TODO',
        responsible_id: defaultResponsibleId !== undefined ? String(defaultResponsibleId) : '',
    }
}

const fieldClassName =
    'w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-base text-gray-100 ' +
    'placeholder:text-gray-500 transition-colors outline-none backdrop-blur-md ' +
    'focus-visible:border-purple-400/50 focus-visible:ring-2 focus-visible:ring-purple-500/20 ' +
    'disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-gray-500'

const selectClassName =
    fieldClassName +
    ' scheme-dark cursor-pointer bg-slate-800/90 ' +
    '[&>option]:bg-slate-900 [&>option]:text-gray-100'

const TaskForm = ({
    task,
    isEditMode,
    responsibleOptions,
    onSuccess,
    onClose,
}: TaskFormProps) => {
    const defaultResponsibleId = responsibleOptions[0]?.id
    const [form, setForm] = useState<FormState>(() =>
        buildInitialState(task, isEditMode, defaultResponsibleId)
    )
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const session = getSessionUser()
    const statusOnly =
        isEditMode &&
        task !== null &&
        session !== null &&
        session.login === 'worker' &&
        task.creator_id !== session.userId

    const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        if (!statusOnly) {
            if (!form.title.trim()) {
                setError('Укажите название задачи')
                return
            }
            if (!form.description.trim()) {
                setError('Укажите описание задачи')
                return
            }
            if (!form.ending_date) {
                setError('Укажите дату завершения')
                return
            }
            if (!form.responsible_id) {
                setError('Выберите ответственного')
                return
            }
        }

        setSubmitting(true)

        try {
            if (isEditMode && task) {
                if (statusOnly) {
                    await updateTask(task.id, { status: form.status })
                } else {
                    await updateTask(task.id, {
                        title: form.title.trim(),
                        description: form.description.trim(),
                        ending_date: form.ending_date,
                        priority: form.priority,
                        status: form.status,
                        responsible_id: Number(form.responsible_id),
                    })
                }
            } else {
                await createTask({
                    title: form.title.trim(),
                    description: form.description.trim(),
                    ending_date: form.ending_date,
                    priority: form.priority,
                    status: form.status,
                    responsible_id: Number(form.responsible_id),
                })
            }
            onSuccess()
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setSubmitting(false)
        }
    }

    const disabled = statusOnly

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {statusOnly && (
                <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                    Задача руководителя: можно изменить только статус.
                </p>
            )}

            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-300">
                Название
                <Input
                    value={form.title}
                    onChange={e => updateField('title', e.target.value)}
                    disabled={disabled || submitting}
                    required={!statusOnly}
                />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-300">
                Описание
                <textarea
                    className={fieldClassName}
                    rows={3}
                    value={form.description}
                    onChange={e => updateField('description', e.target.value)}
                    disabled={disabled || submitting}
                    required={!statusOnly}
                />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-300">
                Дата завершения
                <Input
                    type="date"
                    value={form.ending_date}
                    onChange={e => updateField('ending_date', e.target.value)}
                    disabled={disabled || submitting}
                    required={!statusOnly}
                />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-300">
                Приоритет
                <select
                    className={selectClassName}
                    value={form.priority}
                    onChange={e => updateField('priority', e.target.value as TaskPriority)}
                    disabled={disabled || submitting}
                >
                    {PRIORITY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-300">
                Статус
                <select
                    className={selectClassName}
                    value={form.status}
                    onChange={e => updateField('status', e.target.value as TaskStatus)}
                    disabled={submitting}
                >
                    {STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-300">
                Ответственный
                <select
                    className={selectClassName}
                    value={form.responsible_id}
                    onChange={e => updateField('responsible_id', e.target.value)}
                    disabled={disabled || submitting}
                    required={!statusOnly}
                >
                    {responsibleOptions.length === 0 ? (
                        <option value="">Нет доступных ответственных</option>
                    ) : (
                        responsibleOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))
                    )}
                </select>
            </label>

            {error && (
                <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                    {error}
                </p>
            )}

            <div className="flex gap-2 border-t border-white/10 pt-4">
                <Button
                    type="submit"
                    className="flex-1 border border-white/20 bg-purple-500/40 text-white backdrop-blur-md hover:bg-purple-500/60"
                    disabled={submitting || (!statusOnly && !form.responsible_id)}
                >
                    {submitting ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    className="border-white/20 bg-white/10 text-gray-200 hover:bg-white/20"
                    onClick={onClose}
                    disabled={submitting}
                >
                    Отмена
                </Button>
            </div>
        </form>
    )
}

export { TaskForm }
