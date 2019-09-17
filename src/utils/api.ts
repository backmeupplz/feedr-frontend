// Dependencies
import axios from 'axios'
import { User } from '../models/user'
import * as store from '@/plugins/store'

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
  return (await axios.post(`${base}/bot`, { token }, { headers: getHeaders() }))
    .data
}

function getHeaders() {
  const user = store.user()
  if (!!user && user.token) {
    return { token: user.token }
  } else {
    return undefined
  }
}
