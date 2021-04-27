import { AuthModuleState } from './auth'
import { NotificationModuleState } from './notification'
import { TeamModuleState } from './team'
import { DrawerModuleState } from './drawer'
import { DialogModuleState } from './dialog'

export default interface RootState {
  auth: AuthModuleState
  team: TeamModuleState
  notification: NotificationModuleState
  drawer: DrawerModuleState
  dialog: DialogModuleState
}
