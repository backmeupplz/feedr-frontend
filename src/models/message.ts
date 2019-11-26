export interface Message {
  _id: string

  createdAt: string
  updatedAt: string

  chat: string
  telegramId?: number
  raw?: any
  type: string
  frombot: boolean
}
