import type { Task } from '../types/task.type'
import type { SessionUser } from './authSession'

/** Та же логика, что `isBossTaskForSubordinate` в tasks.service.ts */
const isBossTaskForSubordinate = (task: Task, session: SessionUser): boolean =>
    session.directorId !== null && task.creator_id === session.directorId

export { isBossTaskForSubordinate }
