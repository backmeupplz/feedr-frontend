// Dependencies
import Vue from 'vue'
import Vuex from 'vuex'
import { User } from '../models/user'
import createPersistedState from 'vuex-persistedstate'
import { Bot } from '../models/bot'

// It's the same global hack
declare let sockets: any

Vue.use(Vuex)

export interface State {
  user?: User
  snackbar: SnackbarState
  language?: String
  dark: Boolean
  bots: Bot[]
}

interface LocalizedError {
  en: string
  ru: string
}

interface SnackbarState {
  message: String | LocalizedError
  active: Boolean
  color: String
}

const storeOptions = {
  state: {
    user: undefined,
    snackbar: {
      message: '',
      active: false,
      color: 'success',
    },
    language: undefined,
    dark: false,
    bots: [],
  },
  mutations: {
    setUser(state: State, user: User) {
      state.user = user
      sockets.send('authentication', state.user.token)
    },
    logout(state: State) {
      state.user = undefined
      sockets.send('logout')
    },
    setSnackbar(state: State, snackbar: SnackbarState) {
      state.snackbar = snackbar
    },
    setLanguage(state: State, language: String) {
      state.language = language
    },
    setDark(state: State, dark: Boolean) {
      state.dark = dark
    },
    setBots(state: State, bots: Bot[]) {
      state.bots = bots

      if (state.user) {
        sockets.send('leave_all')
        state.bots.forEach(bot => {
          sockets.send('join', bot._id)
        })
      }
    },
    SOCKET_message(state: State, obj: any) {
      let eventName
      if (obj instanceof Array) {
        eventName = obj[0]
      } else {
        eventName = obj
      }
      switch (eventName) {
        case 'chats': {
          const botId = obj[1]
          const chats = obj[2]
          for (const bot of state.bots) {
            if (bot._id === botId) {
              Vue.set(bot, 'chats', chats)
              break
            }
          }
          break
        }
        case 'messages': {
          const botId = obj[1].bot
          const chatId = obj[1].chat
          const messages = obj[2]
          for (const bot of state.bots) {
            if (bot._id === botId) {
              if (!bot.chats) {
                break
              }
              for (const chat of bot.chats) {
                if (chat._id === chatId) {
                  Vue.set(chat, 'messages', messages)
                  break
                }
              }
              break
            }
          }
          break
        }
        case 'new_message': {
          const botId = obj[1].bot
          const chatId = obj[1].chat
          const message = obj[1]
          for (const bot of state.bots) {
            if (bot._id === botId) {
              if (!bot.chats) {
                break
              }
              for (const chat of bot.chats) {
                if (chat._id === chatId) {
                  Vue.set(chat, 'messages', [message, ...(chat.messages || [])])
                  break
                }
              }
              break
            }
          }
        }
        default:
          break
      }
    },
    SOCKET_connect(state: State) {
      if (state.user) {
        sockets.send('authorization', state.user.token)
      }
    },
  },
  getters: {
    user: (state: State) => state.user,
    snackbar: (state: State) => state.snackbar,
    language: (state: State) => state.language,
    dark: (state: State) => state.dark,
    bots: (state: State) => state.bots,
  },
  plugins: [
    createPersistedState({
      paths: ['user', 'language', 'dark'],
    }),
  ],
}

export const store = new Vuex.Store<State>(storeOptions)

// Getters
const getters = store.getters

export const user = () => getters.user as User | undefined
export const snackbar = () => getters.snackbar as SnackbarState
export const language = () => getters.language as string | undefined
export const dark = () => getters.dark as boolean
export const bots = () => getters.bots as Bot[]

// Mutations
export const setUser = (user: User) => {
  store.commit('setUser', user)
}
export const setSnackbar = (snackbar: SnackbarState) => {
  store.commit('setSnackbar', snackbar)
}
export const setSnackbarError = (message: String) => {
  setSnackbar({
    message,
    color: 'error',
    active: true,
  })
}
export const hideSnackbar = () => {
  store.commit('setSnackbar', { ...store.state.snackbar, active: false })
}
export const setLanguage = (language: String) => {
  store.commit('setLanguage', language)
}
export const setDark = (dark: Boolean) => {
  store.commit('setDark', dark)
}
export const logout = () => {
  store.commit('logout')
}
export const setBots = (bots: Bot[]) => {
  store.commit('setBots', bots)
}
