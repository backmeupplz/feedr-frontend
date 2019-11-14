// Dependencies
import { Chat } from './chat'

export interface Bot {
  _id: string
  telegramId: number
  name: string
  username: string
  greetingMessage: string
  administrated?: boolean

  chats?: Chat[]

  status: string
}
