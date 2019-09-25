// Dependencies
import axios from 'axios'
import { User } from '../models/user'
import { Bot } from '../models/bot'
import * as store from '@/plugins/store/store'

const base = process.env.VUE_APP_API

export async function loginFacebook(accessToken: string) {
  return (await axios.post(`${base}/login/facebook`, {
    accessToken,
  })).data as User
}

export async function loginGoogle(accessToken: string) {
  return (await axios.post(`${base}/login/google`, {
    accessToken,
  })).data as User
}

export async function loginTelegram(loginInfo: any) {
  return (await axios.post(`${base}/login/telegram`, loginInfo)).data as User
}

export async function postBot(token: string) {
  console.log(token)
  return (await axios.post(`${base}/bot`, { token }, { headers: getHeaders() }))
    .data
}

export async function getBots() {
  return (await axios.get(`${base}/bot`, {
    headers: getHeaders(),
  })).data as Bot[]
}

export async function updateBot(bot: Bot) {
  return (await axios.put(`${base}/bot/${bot._id}`, undefined, {
    headers: getHeaders(),
  })).data as Bot[]
}

export async function deleteBot(bot: Bot) {
  return (await axios.delete(`${base}/bot/${bot._id}`, {
    headers: getHeaders(),
  })).data as Bot[]
}

function getHeaders() {
  const user = store.user()
  if (!!user && user.token) {
    return { token: user.token }
  } else {
    return undefined
  }
}
