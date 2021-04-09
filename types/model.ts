export interface Model {
  $key: string | null
}

export interface ExtensibleModel extends Model {
  [key: string]: any
}
