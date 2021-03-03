import Model from './model'

export default interface User extends Model {
  email: string
  image: string
  name: string
  team: string | null
}
