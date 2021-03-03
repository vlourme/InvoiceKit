import Model from './Model'

export default interface User extends Model {
  email: string
  image: string
  name: string
  team: string | null
}
