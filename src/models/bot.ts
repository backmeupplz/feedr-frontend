// Dependencies
import { Chat } from './chat'

export interface Bot {
  _id: string
  telegramId: number
  name: string
  username: string
  greetingMessage: string

  chats?: Chat[]

  status: string
}
