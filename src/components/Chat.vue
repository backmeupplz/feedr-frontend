<template lang="pug">
    v-col(cols='12').columner
            div(v-for='(message, i) in sortedMessages' :key='message._id' v-observe-visibility='(isVisible, entry) => visibilityChanged(isVisible, entry, i, message, curchat, bot)')
              v-row(v-if='frombot(bot, message)' justify='end' class='pa-4')
                MessageComponent(v-bind:message="message")
              v-row(v-if='!frombot(bot, message)' justify='start' class='pa-4') 
                MessageComponent(v-bind:message="message")
</template>


<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AddBotDialog from './AddBotDialog.vue'
import * as api from '../utils/api'
import { Bot } from '../models/bot'
import * as store from '../plugins/store/store'
import { i18n } from '../plugins/i18n'
import { Chat } from '../models/chat'
import MessageComponent from './Message.vue'
import moment from 'moment'
import { Message } from '../models/message'
// Global hack here
declare const sockets: any

@Component({
  components: { MessageComponent },
  props: {
    bot: Object,
    curchat: Object,
    messages: Array,
  },
})
export default class ChatComponent extends Vue {
  text = ''
  messageUpdating = true
  scroll = true

  setUpdating() {
    this.messageUpdating = false
  }

  setScroll() {
    this.scroll = true
  }

  frombot(bot: any, message: any) {
    if (bot.botType === 'telegram') {
      if (bot.telegramId === message.raw.from.id) {
        return true
      }
      return false
    }
    if (bot.botType === 'viber') {
      if (message.frombot) {
        return true
      }
      return false
    }
  }

  updated() {
    this.$nextTick(() => {
      this.messageUpdating = true
      store.setNoMoreMessages(false)
      if (this.scroll) {
        let elem = this.$el
        elem.scrollTop = 100000
      }
      setTimeout(this.setUpdating, 1)
    })
  }

  get sortedMessages() {
    if (!this.$props.curchat) {
      return
    }
    for (const bot of store.bots()) {
      if (bot._id === this.$props.curchat.bot) {
        if (!bot.chats) {
          return []
        }
        for (const chat of bot.chats || []) {
          console.log(this.$props.curchat._id, chat._id)
          if (this.$props.curchat && chat._id === this.$props.curchat._id) {
            if (!chat.messages) {
              sockets.send('request_messages', {
                bot: bot._id,
                chat: chat._id,
              })
              return []
            }
            return chat.messages || []
          }
        }
      }
    }
  }

  async visibilityChanged(
    isVisible: Boolean,
    entry: any,
    sectionIndex: number,
    message: Message,
    chat: Chat,
    bot: Bot,
  ) {
    if (!isVisible) {
      return
    }
    if (this.messageUpdating || store.nomoremessages()) {
      return
    }
    if (sectionIndex == 0) {
      this.loadMessages(message, chat, bot)
    }
  }

  async loadMessages(lastmessage: Message, curchat: Chat, bot: Bot) {
    if (this.messageUpdating) {
      return
    }
    try {
      this.messageUpdating = true
      sockets.send('request_messages', {
        bot: bot._id,
        chat: curchat._id,
        id: lastmessage._id,
      })
    } catch (err) {
      store.setSnackbarError('errors.loadMessages')
    } finally {
      this.messageUpdating = false
      this.scroll = false
      setTimeout(this.setScroll, 200)
    }
  }
}
</script>

<style lang="scss">
.columner {
  height: calc(100%);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>