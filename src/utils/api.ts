// Dependencies
import axios from 'axios'
import { User } from '../models/user'

const base = 'https://backend.feedr.com'
// const base = 'http://localhost:1337'

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
