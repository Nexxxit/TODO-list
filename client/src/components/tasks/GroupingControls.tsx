import type { GroupMode } from './types'

type GroupingControlsProps = {
    group: GroupMode
    onGroupChange: (mode: GroupMode) => void
}

const GroupingControls = ({ group, onGroupChange }: GroupingControlsProps) => (
    <>
        <label htmlFor="dateGroup">По дате завершения</label>
        <input
            type="radio"
            name="groups"
            id="dateGroup"
            value="dateGroup"
            checked={group === 'date'}
            onChange={() => onGroupChange('date')}
        />

        <label htmlFor="responsibleGroup">По ответственным</label>
        <input
            type="radio"
            name="groups"
            id="responsibleGroup"
            value="responsibleGroup"
            checked={group === 'responsible'}
            onChange={() => onGroupChange('responsible')}
        />

        <label htmlFor="noneGroup">Без группировки</label>
        <input
            type="radio"
            name="groups"
            id="noneGroup"
            value="noneGroup"
            checked={group === 'none'}
            onChange={() => onGroupChange('none')}
        />
    </>
)

export { GroupingControls }
