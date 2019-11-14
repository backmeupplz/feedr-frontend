import { Bot } from './bot'

export interface Invite {
  bot: Bot
  inviter: string
  invitee: string

  accepted: boolean
}
