export enum NotificationType {
  SUCCESS,
  INFO,
  WARNING,
  ERROR,
}

export interface Notification {
  message: string
  type: NotificationType
}
