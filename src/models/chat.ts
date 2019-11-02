// Dependencies
import { Message } from './message'

export interface Chat {
  _id: string

  createdAt: string
  updatedAt: string

  bot: string
  telegramId: string
  raw: any
  lastMessage?: Message
  messages?: Message[]

  banned: boolean
}
