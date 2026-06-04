import type { GroupMode } from './types'

type GroupingControlsProps = {
    group: GroupMode
    onGroupChange: (mode: GroupMode) => void
}

const modes: { id: string; value: GroupMode; label: string }[] = [
    { id: 'dateGroup', value: 'date', label: 'По дате завершения' },
    { id: 'responsibleGroup', value: 'responsible', label: 'По ответственным' },
    { id: 'noneGroup', value: 'none', label: 'Без группировки' },
]

const GroupingControls = ({ group, onGroupChange }: GroupingControlsProps) => (
    <fieldset className="w-full min-w-0 max-w-full rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-lg">
        <legend className="sr-only">Режим группировки</legend>
        <div className="flex w-full min-w-0 flex-col gap-1 sm:flex-row">
            {modes.map(mode => (
                <label
                    key={mode.id}
                    htmlFor={mode.id}
                    className={`flex w-full min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg px-3 py-2.5 text-center text-sm font-medium transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-purple-400/50 sm:px-4 ${group === mode.value
                        ? 'bg-purple-500/40 text-white shadow-sm backdrop-blur-md'
                        : 'text-gray-300 hover:bg-white/10 hover:text-gray-100'
                        }`}
                >
                    <input
                        type="radio"
                        name="groups"
                        id={mode.id}
                        value={mode.value}
                        checked={group === mode.value}
                        onChange={() => onGroupChange(mode.value)}
                        className="sr-only"
                    />
                    {mode.label}
                </label>
            ))}
        </div>
    </fieldset>
)

export { GroupingControls }
