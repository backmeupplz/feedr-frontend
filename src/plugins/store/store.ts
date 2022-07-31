// Dependencies
import Vue from 'vue'
import Vuex from 'vuex'
import { User } from '../../models/user'
import createPersistedState from 'vuex-persistedstate'
import { Bot } from '../../models/bot'
import socket from './modules/socket'

Vue.use(Vuex)

// It's the same global hack
declare let sockets: any

export interface State {
  user?: User
  snackbar: SnackbarState
  language?: String
  dark: Boolean
  bots: Bot[]
  invites: Invite[]
  nomoremessages: Boolean
  loading: {
    chatloading: Boolean
    botsloading: Boolean
  }
  botTab: Number
  activeChat: boolean
}

interface Invite {
  inviter: string
  inviteID: string
  bot: string
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
    dark: true,
    bots: [],
    invites: [],
    nomoremessages: false,
    loading: {
      chatloading: false,
      botsloading: false,
    },
    botTab: 0,
    activeChat: false,
  },
  mutations: {
    setUser(state: State, user: User) {
      state.user = user
      sockets.send('authentication', state.user.token)
    },
    async addChats(state: State, chat: any) {
      let botId = chat[0]
      chat = chat[1]
      if (Array.isArray(chat)) {
        for (const bot of state.bots) {
          if (bot._id === botId) {
            if (bot.chats) {
              const newchats = await Promise.all(
                chat.filter((chat: any) => {
                  return !(bot as any).chats.find((v: any) => {
                    if (chat._id === v._id) {
                      return v
                    }
                  })
                })
              )
              if (!newchats) {
                return
              }
              bot.chats.push(...newchats)
            }
          }
        }
      } else {
        for (const bot of state.bots) {
          if (bot._id === botId) {
            if (bot.chats) {
              if (
                bot.chats.find((v) => {
                  if (v._id === chat._id) {
                    return v
                  }
                })
              ) {
                return
              }
              bot.chats.push(chat)
            }
          }
        }
      }
    },
    async addMessages(state: State, message: any) {
      let botId = message[0]
      let chatId = message[1]
      message = message[2]
      if (Array.isArray(message)) {
        for (const bot of state.bots) {
          if (bot._id === botId) {
            if (bot.chats) {
              for (const chat of bot.chats) {
                if (
                  chat._id === chatId &&
                  bot.selected_chat &&
                  bot.selected_chat._id === chat._id
                ) {
                  if (!chat.messages?.length) {
                    chat.messages = []
                    chat.messages.push(...message)
                    return
                  }
                  const newMessages = await Promise.all(
                    message.filter((msg: any) => {
                      return !(chat as any).messages.find((v: any) => {
                        if (msg._id === v._id) {
                          return v
                        }
                      })
                    })
                  )
                  if (!newMessages) {
                    return
                  }
                  chat.messages.push(...newMessages)
                }
              }
            }
          }
        }
      } else {
        for (const bot of state.bots) {
          if (bot._id === botId) {
            if (bot.chats) {
              for (const chat of bot.chats) {
                if (
                  chat._id === chatId &&
                  bot.selected_chat &&
                  bot.selected_chat._id === chat._id
                ) {
                  if (
                    (chat as any).messages.find((v: any) => {
                      if (message._id === v._id) {
                        return v
                      }
                    })
                  ) {
                    return
                  }
                  if (!chat?.messages?.length) {
                    chat.messages = []
                    chat.messages.push(message)
                    return
                  }
                  chat.messages.push(message)
                  return
                }
              }
            }
          }
        }
      }
    },
    readMessage(state: State, message: any) {
      for (const chat of (state as any).bots[(state as any).botTab].chats) {
        if (
          chat._id ===
          (state as any).bots[(state as any).botTab].selected_chat._id
        ) {
          for (const messages of chat.messages) {
            if (messages._id === message._id) {
              message.unread = undefined
              return
            }
          }
        }
      }
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
    setChatLoading(state: State, chatloading: Boolean) {
      state.loading.chatloading = chatloading
    },
    setBotsLoading(state: State, botsloading: Boolean) {
      state.loading.botsloading = botsloading
    },
    async setBots(state: State, bots: any) {
      if (bots.bots) {
        await Promise.all(
          bots.bots.map((bot: any) => {
            bot.chats = []
            bot.selected_chat = undefined
            return bot
          })
        )
      }

      let updatedBots: Bot[] = [
        {
          _id: '__feed',
          botType: 'feed',
          name: 'Feed',
          username: '',
          greetingMessage: '',
          chats: [],
          unread: 0,
          status: 'active',
        },
      ]
      updatedBots.push(...bots.bots)

      updatedBots = updatedBots.map((bot: Bot) => {
        for (const oldBot of state.bots) {
          if (bot._id === oldBot._id) {
            bot.chats = oldBot.chats
            bot.selected_chat = oldBot.selected_chat
            return bot
          }
        }
        return bot
      })

      state.bots = updatedBots

      const updatedChats = []

      for (const chat of (state as any).bots[0].chats) {
        for (const bot of updatedBots) {
          if (chat.bot === bot._id) {
            updatedChats.push(chat)
          }
        }
      }

      state.bots[0].chats = updatedChats

      state.invites = bots.invites

      if (state.user) {
        sockets.send('leave_all')
        state.bots.forEach((bot) => {
          sockets.send('join', bot._id)
        })
      }
    },
    setNoMoreMessages(state: State, nomoremessages: Boolean) {
      state.nomoremessages = nomoremessages
    },
    setBotTab(state: State, tab: Number) {
      state.botTab = tab
    },
    setActiveChat(state: State, active: boolean) {
      state.activeChat = active
    },
  },
  getters: {
    user: (state: State) => state.user,
    snackbar: (state: State) => state.snackbar,
    language: (state: State) => state.language,
    dark: (state: State) => state.dark,
    chatloading: (state: State) => state.loading.chatloading,
    botsloading: (state: State) => state.loading.botsloading,
    bots: (state: State) => state.bots,
    invites: (state: State) => state.invites,
    nomoremessages: (state: State) => state.nomoremessages,
    bottab: (state: State) => state.botTab,
    activeChat: (state: State) => state.activeChat,
  },
  plugins: [
    createPersistedState({
      paths: ['user', 'language'],
    }),
  ],
  modules: {
    socket,
  },
}

export const store = new Vuex.Store<State>(storeOptions)

// Getters
const getters = store.getters

export const user = () => getters.user as User | undefined
export const snackbar = () => getters.snackbar as SnackbarState
export const language = () => getters.language as string | undefined
export const dark = () => getters.dark as boolean
export const chatLoading = () => getters.chatloading as boolean
export const botsloading = () => getters.botsloading as boolean
export const bots = () => getters.bots as Bot[]
export const invites = () => getters.invites as Invite[]
export const nomoremessages = () => getters.nomoremessages as boolean
export const botTab = () => getters.bottab as number
export const activeChat = () => getters.activeChat as boolean

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
export const setChatLoading = (loading: Boolean) => {
  store.commit('setChatLoading', loading)
}
export const setBotsLoading = (loading: Boolean) => {
  store.commit('setBotsLoading', loading)
}
export const logout = () => {
  store.commit('logout')
}
export const setBots = (bots: any) => {
  store.commit('setBots', bots)
}
export const setNoMoreMessages = (nomoremessages: Boolean) => {
  store.commit('setNoMoreMessages', nomoremessages)
}

export const setBotTab = (tab: Number) => {
  store.commit('setBotTab', tab)
}

export const setActiveChat = (active: boolean) => {
  store.commit('setActiveChat', active)
}

export const addChat = (chat: any) => {
  store.commit('addChat', chat)
}

export const addChats = (chat: any, botId: string) => {
  store.commit('addChats', [botId, chat])
}

export const addMessages = (message: any, chatId: string, botId: string) => {
  store.commit('addMessages', [botId, chatId, message])
}

export const readMessage = (message: any) => {
  store.commit('readMessage', message)
}
