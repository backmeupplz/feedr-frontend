<template lang="pug">
    v-col(cols='12' :style="heightStyle").columner
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
  watch: {
    lastMessage: function(val) {
      let that = this as any
      let needScroll = true
      if (
        that.chatUpdated &&
        that.$props.curchat &&
        that.chatUpdated < that.$props.curchat.updated
      ) {
        that.chatUpdated = that.$props.curchat.updatedAt
        that.last = val
        that.chatUpdate()
        that.scroll()
        return
      }
      if (!that.last) {
        that.chatUpdated = that.$props.curchat.updatedAt
        that.last = val
        that.chatUpdate()
        that.scroll()
        return
      }
      if (that.last.chat !== val.chat) {
        that.last = val
        that.chatUpdate()
        that.scroll()
        return
      }
      if (that.last && val && !val.frombot) {
        needScroll = false
      }
      if (val !== that.last) {
        that.last = val
        that.chatUpdate()
        if (needScroll) {
          that.scroll()
        }
      }
    },
  },
})
export default class ChatComponent extends Vue {
  last: any
  text = ''
  chatUpdated: any
  messageUpdating = true

  scrollTimer() {
    let elem = this.$el
    elem.scrollTop = 100000
  }

  scroll() {
    this.chatUpdate()
    setTimeout(this.scrollTimer, 200)
  }
  chatUpdate() {
    let that = this
    let chat = this.$props.curchat || undefined
    this.messageUpdating = true
    setTimeout(() => (that.messageUpdating = false), 700)
    if (chat) {
      sockets.send('read_chat', {
        botId: chat.bot,
        chatId: chat._id,
      })
    }
  }

  frombot(bot: any, message: any) {
    if (message.frombot) {
      return true
    }
    return false
  }

  get lastMessage() {
    if (
      this.$props.curchat &&
      this.$props.curchat.messages.length > 0 &&
      this.sortedMessages
    ) {
      let lastmsg: any
      return (this as any).sortedMessages[
        (this as any).sortedMessages.length - 1
      ]
    }
    return []
  }

  updated() {
    this.$nextTick(() => {
      store.setNoMoreMessages(false)
    })
  }

  get sortedMessages() {
    if (!this.$props.curchat || !this.$props.bot) {
      return
    }
    for (const bot of store.bots()) {
      if (bot._id === this.$props.bot._id) {
        if (!bot.chats) {
          return []
        }
        for (const chat of bot.chats || []) {
          if (this.$props.curchat && chat._id === this.$props.curchat._id) {
            if (!chat.messages) {
              sockets.send('request_messages', {
                bot: chat.bot,
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

  get heightStyle() {
    let height = document.documentElement.clientHeight - 400;
    return { height: height + "px !important;"} 
  };
  
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
        bot: curchat.bot,
        chat: curchat._id,
        id: lastmessage._id,
      })
    } catch (err) {
      store.setSnackbarError('errors.loadMessages')
    } finally {
      this.messageUpdating = false
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
