import { MemberPermission } from '~/types/team'

/**
 * Transform permission integer to text
 */
export default (permission: MemberPermission): string => {
  const texts = {
    [MemberPermission.Viewer]: 'Lecteur',
    [MemberPermission.Editor]: 'Éditeur',
    [MemberPermission.Admin]: 'Administrateur',
  }

  return texts[permission]
}
