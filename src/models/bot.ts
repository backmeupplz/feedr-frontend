// Dependencies
import { Chat } from './chat'

export interface Bot {
  _id: string
  telegramId?: number
  viberAvatar?: string
  botType: string
  name: string
  username: string
  greetingMessage: string
  administrated?: boolean

  chats?: Chat[]

  status: string
}
