import Auth from '@/types/auth'
import User from '@/types/user'
import Team from '@/types/team'
import { Notification } from '~/types/notification'

export default () => ({
  auth: null as Auth | null,
  user: null as User | null,
  teams: null as { [key: string]: Team } | null,
  team: null as Team | null,
  drawer: true,
  notification: null as Notification | null,
})
