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
  selected_chat?: Chat
  no_more_chats?: boolean
  chatsloading?: boolean
  oldestLoadedChat?: Chat
  unread: number

  status: string
}
