// Dependencies
import axios from 'axios'
import { User } from '../models/user'
import { Bot } from '../models/bot'
import { Chat } from '../models/chat'
import { Message } from '../models/message'
import * as store from '@/plugins/store/store'

const base = process.env.VUE_APP_API

export interface InvitesAdminsArray {
  type: string
  id: string
  name: string
  accepted?: boolean
}

export async function loginFacebook(accessToken: string) {
  return (
    await axios.post(`${base}/login/facebook`, {
      accessToken,
    })
  ).data as User
}

export async function loginGoogle(accessToken: string) {
  return (
    await axios.post(`${base}/login/google`, {
      accessToken,
    })
  ).data as User
}

export async function loginTelegram(loginInfo: any) {
  return (await axios.post(`${base}/login/telegram`, loginInfo)).data as User
}

export async function postBot(token: string, type: string) {
  return (
    await axios.post(`${base}/bot`, { token, type }, { headers: getHeaders() })
  ).data
}

export async function BotInviteAdmin(
  bot: string,
  userid: string,
  usertype: string,
) {
  return (
    await axios.post(
      `${base}/invite/${bot}`,
      { userid, usertype },
      { headers: getHeaders() },
    )
  ).data
}

export async function GetInvitesAndAdministrators(bot: string) {
  return (await axios.get(`${base}/invite/${bot}`, { headers: getHeaders() }))
    .data as InvitesAdminsArray[]
}

export async function RejectInvite(invite: string) {
  return (
    await axios.delete(`${base}/invite/${invite}`, { headers: getHeaders() })
  ).data
}

export async function RejectBot(bot: string) {
  return (
    await axios.delete(`${base}/bot/reject/${bot}`, { headers: getHeaders() })
  ).data
}

export async function RejectAdmin(admin: string, bot: string, type: string) {
  return (
    await axios.put(
      `${base}/admin/${admin}`,
      { bot, type },
      { headers: getHeaders() },
    )
  ).data
}

export async function AcceptInvite(invite: string) {
  return (
    await axios.put(`${base}/invite/${invite}`, null, {
      headers: getHeaders(),
    })
  ).data
}

export async function getBots() {
  try {
    store.setBotsLoading(true)
    const response = (
      await axios.get(`${base}/bot`, {
        headers: getHeaders(),
      })
    ).data as any
    store.setBotsLoading(false)
    return response
  } catch (e) {
    store.setBotsLoading(true)
    store.setSnackbar({
      message: e,
      color: 'error',
      active: true,
    })
  }
}

export async function updateBot(bot: Bot) {
  return (
    await axios.put(
      `${base}/bot/${bot._id}`,
      { action: 'update' },
      {
        headers: getHeaders(),
      },
    )
  ).data as Bot[]
}

export async function BotChangeGreetings(botId: string, greetings: string) {
  return (
    await axios.put(
      `${base}/bot/${botId}`,
      { action: 'changeGreetings', greetingMessage: greetings },
      {
        headers: getHeaders(),
      },
    )
  ).data as Bot[]
}

export async function deleteBot(bot: Bot) {
  return (
    await axios.delete(`${base}/bot/${bot._id}`, {
      headers: getHeaders(),
    })
  ).data as Bot[]
}

export async function banChat(chat: Chat) {
  return (
    await axios.put(
      `${base}/chat/${chat._id}`,
      { action: 'ban' },
      {
        headers: getHeaders(),
      },
    )
  ).data as Bot[]
}

export async function getFilesLink(message: Message) {
  if (!(message as any).editIndex) {
    return (
      await axios.get(`${base}/message/${message._id}`, {
        headers: getHeaders(),
      })
    ).data as any
  } else
    return (
      await axios.get(
        `${base}/message/${message._id}/${(message as any).editIndex}`,
        {
          headers: getHeaders(),
        },
      )
    ).data as any
}

export async function unbanChat(chat: Chat) {
  return (
    await axios.put(
      `${base}/chat/${chat._id}`,
      { action: 'unban' },
      {
        headers: getHeaders(),
      },
    )
  ).data as Bot[]
}

function getHeaders() {
  const user = store.user()
  if (!!user && user.token) {
    return { token: user.token }
  } else {
    return undefined
  }
}
