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
    socket_chats(state: State, object: any) {
      const botId = object[1]
      const chats = object[2]
      for (const bot of state.bots) {
        if (bot._id === botId) {
          Vue.set(bot, 'chats', chats)
          return
        }
      }
    },
    socket_messages(state: State, object: any) {
      const botId = object[1].bot
      const chatId = object[1].chat
      const messages = object[2]
      for (const bot of state.bots) {
        if (bot._id === botId) {
          for (const chat of bot.chats || []) {
            if (chat._id === chatId) {
              Vue.set(chat, 'messages', messages)
              return
            }
          }
          return
        }
      }
    },
    socket_new_message(state: State, object: any) {
      for (const bot of state.bots) {
        if (bot._id === object.bot) {
          if (!bot.chats) {
            return
          }
          for (const chat of bot.chats || []) {
            if (chat._id === object.chat) {
              Vue.set(chat, 'messages', [object, ...(chat.messages || [])])
              Vue.set(chat, 'lastMessage', object)
              return
            }
          }
          return
        }
      }
    },
    socket_new_chat(state: State, object: any) {
      const botId = object.bot
      for (const bot of state.bots) {
        if (bot._id === botId) {
          Vue.set(bot, 'chats', [object, ...(bot.chats || [])])
        }
      }
    },
    socket_message(_: State, obj: any) {
      let eventName: string = obj instanceof Array ? obj[0] : obj
      switch (eventName) {
        case 'chats':
          store.commit('socket_chats', obj)
          break
        case 'messages':
          store.commit('socket_messages', obj)
          break
        default:
          break
      }
    },
    socket_connect(state: State) {
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
