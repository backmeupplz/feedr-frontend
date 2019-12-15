import { State, bots } from '../store'
import Vue from 'vue'
import { store, user, setSnackbarError } from '../store'
import * as storemodule from '../store'
import vm from '../../../main'
import { Chat } from '../../../models/chat'

// It's the same global hack
declare let sockets: any

const mutations = {
  async socket_chats_paginated(state: State, object: any) {
    const botId = object[1]
    const chats = object[2]

    for (const bot of store.state.bots) {
      if (bot._id === botId) {
        if (chats.length < 1) {
          return
        }
        if (!bot.chats) {
          return
        }
        if (chats.length < 20) {
          Vue.set(bot, 'no_more_chats', true)
          const newchats = await Promise.all(
            chats.filter((chat: Chat) => {
              return !(bot as any).chats.find((v: any) => {
                if (chat._id === v._id) {
                  return v
                }
              })
            }),
          )
          console.log(newchats)
          let oldestChat = await newchats.reduce((min: any, cur: any) =>
            min.updatedAt < cur.updatedAt ? min : cur,
          )
          Vue.set(bot, 'oldestLoadedChat', oldestChat)
          Vue.set(bot, 'chatsloading', false)
          storemodule.addChats(newchats)
          return
        }
        const newchats = await Promise.all(
          chats.filter((chat: Chat) => {
            return !(bot as any).chats.find((v: any) => {
              if (chat._id === v._id) {
                return v
              }
            })
          }),
        )
        let oldestChat = await newchats.reduce((min: any, cur: any) =>
          min.updatedAt < cur.updatedAt ? min : cur,
        )
        Vue.set(bot, 'oldestLoadedChat', oldestChat)
        Vue.set(bot, 'chatsloading', false)
        storemodule.addChats(newchats)
      }
    }
  },

  async socket_requested_chat(state: State, object: any) {
    const chat = object[1]
    const error = object[2]
    if (error) {
      setSnackbarError(error)
      vm.$router.replace('/app')
      return
    }
    if (!error && !chat) {
      setSnackbarError('errors.chat.not_found')
      vm.$router.replace('/app')
      return
    }
    if (chat) {
      let botNumber = 0
      ;(await Promise.all(
        store.state.bots.filter((v, k) => {
          if (chat.bot === v._id) {
            botNumber = k
            return v
          }
        }),
      )) as any

      store.state.botTab = botNumber
      chat.requested = true
      for (const bot of store.state.bots) {
        if (bot._id === chat.bot) {
          if (!bot.chats) {
            return
          }
          storemodule.addChats(chat)
          Vue.set(bot, 'selected_chat', chat)
        }
      }
      vm.$router.replace('/app')
      return
    }
  },
  async socket_chats(state: State, object: any) {
    const botId = object[1]
    const chats = object[2]
    for (const bot of store.state.bots) {
      if (bot._id === botId) {
        if (chats.length > 0) {
          let oldestChat = await chats.reduce((min: any, cur: any) =>
            min.updatedAt < cur.updatedAt ? min : cur,
          )
          Vue.set(bot, 'oldestLoadedChat', oldestChat)
          storemodule.addChats(chats)
        }
      }
    }

    // For /chat url
    if (vm.$route.name === 'chat') {
      const findchat = chats.filter((chat: any) => {
        return chat._id === vm.$route.params.id
      }) as any

      await Promise.all(findchat)
      if (!(findchat.length < 1)) {
        let botNumber = 0
        const selectBot = (await Promise.all(
          store.state.bots.filter((v, k) => {
            if (botId === v._id) {
              botNumber = k
              return v
            }
          }),
        )) as any

        store.state.botTab = botNumber
        for (const bot of store.state.bots) {
          if (selectBot && bot._id === selectBot[0]._id) {
            Vue.set(bot, 'selected_chat', findchat[0])
          }
        }
        vm.$router.replace('/app')
        return
      }

      const existschats = store.state.bots.filter(bot => {
        return bot.chats
      })
      await Promise.all(existschats)
      if (existschats.length === store.state.bots.length) {
        sockets.send('request_chat', {
          id: vm.$route.params.id,
        })
      }
    }
    return
  },
  async socket_updated_chat(state: State, object: any) {
    const chat = object
    for (const bot of store.state.bots) {
      if (bot._id === chat.bot) {
        if (!bot.chats) {
          return
        }
        for (const i in bot.chats) {
          if (bot.chats[Number(i)]._id === chat._id) {
            let newChat = bot.chats[i]
            if (newChat.updatedAt > chat.updatedAt) {
              return
            }
            if (chat.hasOwnProperty('bot_counter')) {
              Vue.set(bot, 'unread', chat.bot_counter)
            }
            newChat = Object.assign(newChat, chat) // now it is true new chat
            bot.chats.splice(Number(i), 1, newChat)
          }
        }
        return
      }
    }
  },
  async socket_bot_counter(state: State, object: any) {
    const updatedbot = object as any
    for (const bot of store.state.bots) {
      if (bot._id === updatedbot.id) {
        Vue.set(bot, 'unread', updatedbot.unread)
        return
      }
    }
  },
  socket_messages(state: State, object: any) {
    const botId = object[1].bot
    const chatId = object[1].chat
    const messages = object[2]
    const paginated = object[3]
    for (const bot of store.state.bots) {
      if (bot._id === botId) {
        for (const chat of bot.chats || []) {
          if (chat._id === chatId) {
            if (!paginated) {
              Vue.set(chat, 'messages', messages)
            } else {
              if (messages.length < 1) {
                store.state.nomoremessages = true
                return
              }
              Vue.set(chat, 'messages', [...messages, ...(chat.messages || [])])
            }
            store.state.loading.chatloading = false
            return
          }
        }
        return
      }
    }
  },
  async socket_new_message(state: State, object: any) {
    for (const bot of store.state.bots) {
      if (bot._id === object.bot) {
        if (!bot.chats) {
          return
        }
        for (const chat of bot.chats || []) {
          if (chat._id === object.chat) {
            if (!chat.messages) {
              sockets.send('request_messages', {
                bot: bot._id,
                chat: chat._id,
              })
              Vue.set(chat, 'lastMessage', object)
              return
            }
            Vue.set(chat, 'messages', [...(chat.messages || []), object])
            Vue.set(chat, 'lastMessage', object)
            return
          }
        }
        return
      }
    }
  },
  async socket_new_chat(state: State, object: any) {
    const botId = object.bot
    for (const bot of store.state.bots) {
      if (bot._id === botId) {
        let filter: any
        if (bot.chats) {
          filter = bot.chats.filter(chat => {
            return chat === object
          }) as any
          await Promise.all(filter)
        } else {
          filter = false
        }
        if (!filter || filter.length < 1) {
          storemodule.addChats(object)
        }
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
      case 'chats_paginated':
        store.commit('socket_chats_paginated', obj)
        break
      case 'requested_chat':
        store.commit('socket_requested_chat', obj)
        break
      case 'error':
        setSnackbarError(`errors.bot.${obj[1]}`)
        break
      default:
        break
    }
  },
  socket_connect(state: State) {
    const client = user()
    if (client) {
      sockets.send('authorization', client.token)
      bots().forEach(bot => {
        sockets.send('join', bot._id)
      })
    }
  },
}

export default {
  mutations,
}
