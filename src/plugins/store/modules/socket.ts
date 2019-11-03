import { State, bots } from '../store'
import Vue from 'vue'
import { store, user } from '../store'

// It's the same global hack
declare let sockets: any

const mutations = {
  socket_chats(state: State, object: any) {
    const botId = object[1]
    const chats = object[2]
    for (const bot of store.state.bots) {
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
    for (const bot of store.state.bots) {
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
    for (const bot of store.state.bots) {
      if (bot._id === object.bot) {
        if (!bot.chats) {
          return
        }
        for (const chat of bot.chats || []) {
          if (chat._id === object.chat) {
            Vue.set(chat, 'messages', [...(chat.messages || []), object])
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
    for (const bot of store.state.bots) {
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
