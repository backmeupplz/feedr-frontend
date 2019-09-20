// Dependencies
import { Message } from './message'

export interface Chat {
  bot: string
  telegramId: string
  raw: any
  messages: Message[]
}
