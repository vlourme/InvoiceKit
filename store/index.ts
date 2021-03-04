import { AuthModuleState } from './auth'
import { NotificationModuleState } from './notification'
import { PayloadModuleState } from './payload'
import { SidebarModuleState } from './sidebar'
import { TeamModuleState } from './team'

export default interface RootState {
  auth: AuthModuleState
  team: TeamModuleState
  notification: NotificationModuleState
  sidebar: SidebarModuleState
  payload: PayloadModuleState
}
