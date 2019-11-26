<template lang="pug">
v-menu(left bottom v-if="chat")
            template(v-slot:activator="{ on }")
                v-btn(icon v-on="on")
                    v-icon mdi-dots-vertical
            v-list
                v-list-item(@click="unban(chat);" v-if="chat && chat.banned")
                    v-list-item-title {{$t('chat.unban')}}
                v-list-item(@click="ban(chat);" v-else-if="chat")
                    v-list-item-title {{$t('chat.ban')}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store/store'
import { i18n } from '../plugins/i18n'
import * as api from '../utils/api'
import { Chat } from '../models/chat'

@Component({
  props: ['chat'],
})
export default class ChatMenu extends Vue {
  get mobile() {
    return true
  }

  async ban(chat: Chat) {
    try {
      await api.banChat(chat)
      for (const bot of store.bots()) {
        if (bot._id === chat.bot && bot.chats) {
          const chats = bot.chats.map(botchat => {
            if (botchat._id === chat._id) {
              botchat.banned = true
            }
            return botchat
          })
          Vue.set(bot, 'chats', chats)
        }
      }
    } catch (e) {
      store.setSnackbar({
        message: 'errors.chat.ban',
        color: 'error',
        active: true,
      })
    }
  }

  async unban(chat: Chat) {
    try {
      await api.unbanChat(chat)
      for (const bot of store.bots()) {
        if (bot._id === chat.bot && bot.chats) {
          const chats = bot.chats.map(botchat => {
            if (botchat._id === chat._id) {
              botchat.banned = false
            }
            return botchat
          })
          Vue.set(bot, 'chats', chats)
        }
      }
    } catch {
      store.setSnackbar({
        message: 'errors.chat.unban',
        color: 'error',
        active: true,
      })
    }
  }
}
</script>