export enum DialogType {
  Success,
  Warning,
  Error,
}

export interface Dialog {
  type: DialogType
  title: string
  message: string
  showCancel: boolean
  actionMessage: string
  callback: Function
}
