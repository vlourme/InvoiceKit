export interface Model {
  $key?: string
}

export interface ExtensibleModel extends Model {
  [key: string]: any
}
