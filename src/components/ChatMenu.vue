<template lang="pug">
v-menu(left, bottom, v-if='chat')
  template(v-slot:activator='{ on }')
    v-btn(icon, color='grey', v-on='on')
      v-icon mdi-dots-vertical
  v-list
    v-dialog(v-model='modalProfile', persistent, width='500')
      template(v-slot:activator='{ on }')
        v-list-item(@click.stop='modalProfile = true', v-if='chat')
          v-list-item-title {{ $t("chat.profile") }}
      v-card
        v-card-title {{ getChatName(chat) }}
        v-card-text FeedrID: {{ chat._id }}
        v-card-text(v-if='chat.type === "telegram"') TelegramID: {{ chat.telegramId }}
        v-card-text(v-if='chat.type === "vk"') VK Profile:
          a(target='_blank', :href='`https://vk.com/id${chat.raw.id}`') https://vk.com/id{{ chat.raw.id }}
        v-card-text(v-if='chat.raw.username') 
          | Username:
          a(target='_blank', :href='`https://t.me/${chat.raw.username}`') @{{ chat.raw.username }}
        v-card-text(v-else-if='chat.type === "viber"') ViberID: {{ chat.viberId }}
        v-card-text(v-else-if='chat.type === "vk"') VkID: {{ chat.raw.id }}
        v-card-text(v-if='chat.banned') 
          b {{ $t("chat.banned") }}!
        v-card-actions
          v-spacer
          v-btn(color='blue', text, @click='modalProfile = false') {{ $t("close") }}
    v-list-item(@click='unban(chat)', v-if='chat && chat.banned')
      v-list-item-title {{ $t("chat.unban") }}
    v-list-item(@click='ban(chat)', v-else-if='chat')
      v-list-item-title {{ $t("chat.ban") }}
    v-list-item(@click='copy(chat)', v-if='chat')
      v-list-item-title {{ $t("text.copy") }}
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
  modalProfile = false

  get mobile() {
    return true
  }

  getChatName(chat: Chat) {
    if (chat.raw.name) {
      return chat.raw.name
    }
    let name = ''
    if (chat.raw.first_name) {
      name = chat.raw.first_name
    }
    if (chat.raw.last_name) {
      name = `${name} ${chat.raw.last_name}`
    }
    if (!name) {
      return i18n.t('chat.noname')
    }
    return name
  }

  async ban(chat: Chat) {
    try {
      await api.banChat(chat)
      for (const bot of store.bots()) {
        if (bot._id === chat.bot && bot.chats) {
          const chats = bot.chats.map((botchat) => {
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

  copy(chat: Chat) {
    const textarea = document.createElement('textarea')
    let value = `https://feedr.chat/app/chat/${chat._id}`

    textarea.value = value
    textarea.setAttribute('readonly', '')
    textarea.style.cssText =
      'position:fixed;pointer-events:none;z-index:-9999;opacity:0;'

    document.body.appendChild(textarea)

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const editable = textarea.contentEditable
      const readOnly = textarea.readOnly

      textarea.contentEditable = 'true'
      textarea.readOnly = true

      const range = document.createRange()

      range.selectNodeContents(textarea)

      const selection = window.getSelection() as any

      selection.removeAllRanges()
      selection.addRange(range)
      textarea.setSelectionRange(0, 999999)

      textarea.contentEditable = editable
      textarea.readOnly = readOnly
    } else {
      textarea.select()
    }

    let success = false

    try {
      success = document.execCommand('copy')
      store.setSnackbar({
        message: 'text.copied',
        color: 'success',
        active: true,
      })
    } catch (err) {
      console.warn(err)
    }

    document.body.removeChild(textarea)

    return success
  }

  async unban(chat: Chat) {
    try {
      await api.unbanChat(chat)
      for (const bot of store.bots()) {
        if (bot._id === chat.bot && bot.chats) {
          const chats = bot.chats.map((botchat) => {
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
