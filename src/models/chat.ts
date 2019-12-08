// Dependencies
import { Message } from './message'

export interface Chat {
  _id: string

  createdAt: string
  updatedAt: string

  bot: string
  telegramId?: string
  viberId?: string
  raw?: any
  lastMessage?: Message
  messages?: Message[]
  requested?: boolean
  type: string
  unread: number

  banned: boolean
}
