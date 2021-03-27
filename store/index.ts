import { AuthModuleState } from './auth'
import { NotificationModuleState } from './notification'
import { PayloadModuleState } from './payload'
import { TeamModuleState } from './team'

export default interface RootState {
  auth: AuthModuleState
  team: TeamModuleState
  notification: NotificationModuleState
  payload: PayloadModuleState
}
