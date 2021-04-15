import { Model } from './model'
import { MemberPermission } from './team'

export interface Invite extends Model {
  name: string
  owner: string
  teamId: string
  role: MemberPermission
}
