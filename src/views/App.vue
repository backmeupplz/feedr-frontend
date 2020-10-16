<template lang="pug">
.app-view-main-container
  v-progress-linear(indeterminate, v-if='BotsLoading')
  .app-view-main-container.d-flex
    AllBots(:setActiveBot='setActiveBot')
    .d-flex.flex-column.app-view-bots-messages-container
      .d-flex.app-view-bot-message-title-container.justify-space-between(
        v-if='!BotsLoading && activeBot && activeBot.name'
      )
        .app-view-bot-message-title-botname {{ activeBot.name }}
        .app-view-bot-message-title-unread {{ activeBot.unread }}
      .app-view-bot-divier
      .d-flex.app-view-bot-message-chats.align-center(
        v-for='chat in activeBot.chats',
        :key='chat._id',
        @click='openChat(chat)'
      )
        .app-view-user-avatar-circle
        .d-flex.flex-column.app-view-bot-container-text.app-view-max-width
          .d-flex.justify-space-between
            .d-flex.app-view-bot-container-text
              .app-view-bot-container-text.app-view-bot-container-text.mr-2 {{ chat.raw.first_name }}
              .app-view-bot-container-text {{ chat.raw.last_name }}
            .app-view-bot-container-timestamp.ml-2 {{ beautifylDate(chat.lastMessage.raw.date) }}
          .d-flex.justify-space-between
            .app-view-bot-message-text.app-view-bot-container-text {{ chat.lastMessage.raw.text }}
            .app-view-bot-container-person-unread {{ chat.unread > 99 ? "99+" : chat.unread }}
    ChatPreview(:chat='activeChat')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import NoBots from '../components/NoBots.vue'
import BotView from '../components/BotView.vue'
import AllBots from '@/components/AllBots.vue'
import ChatPreview from '@/components/ChatPreview.vue'
import * as store from '../plugins/store/store'
import { Bot } from '@/models/bot'
import { Chat } from '@/models/chat'
import { unixToDate } from '@/utils/beautifulDate'
declare const sockets: any

@Component({
  components: { NoBots, BotView, AllBots, ChatPreview },
})
export default class Superpower extends Vue {
  activeBot = store.bots()[0] || ''
  activeChat: Chat | any = ''

  text = ''

  beautifylDate(stamp: number) {
    return unixToDate(stamp)
  }

  setActiveBot(bot: Bot) {
    this.activeBot = bot
    sockets.send('request_messages', {
      bot: bot,
    })
  }

  openChat(chat: Chat) {
    const date = Number(new Date())
    if (this.activeChat) {
      if (this.activeChat._id === chat._id) {
        return
      }
    }
    if (this.activeChat && this.activeChat._id !== chat._id) {
      Vue.set(this.activeChat, 'messages', [])
    }
    this.activeChat = chat
    for (const bot of store.bots()) {
      if (bot && bot._id === this.activeBot._id) {
        Vue.set(chat, 'messages', [])
        Vue.set(bot, 'selected_chat', chat)
      }
    }
    if (
      !(this.activeChat.messages && this.activeChat.messages.length) &&
      !store.chatLoading()
    ) {
      store.setChatLoading(true)
      Vue.set(this.activeChat, 'messages', [])
      sockets.send('request_messages', {
        bot: chat.bot,
        chat: chat._id,
      })
    }
    this.activeChat = chat
  }

  get tab() {
    return store.botTab()
  }
  set tab(value) {
    store.setBotTab(value)
  }

  get BotsLoading() {
    const feedBot = store.bots()[0]
    if (!store.botsloading() && feedBot) {
      this.activeBot = feedBot
    }
    return store.botsloading()
  }
}
</script>

<style>
.app-view-main-container {
  height: 100%;
  max-width: 100%;
}

.app-view-bot-container-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-view-bot-divier {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  box-sizing: border-box;
}

.app-view-bots-messages-container {
  background: #0f0f22;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  width: 300px;
}

.app-view-bot-message-title-container {
  font-weight: bold;
  font-size: 22px;
  line-height: 29px;
  display: flex;
  align-items: center;
  color: #ffffff;
  padding: 20px 12px 20px 24px;
  height: 60px;
  max-height: 60px;
}

.app-view-bot-message-title-botname {
  font-weight: bold;
  font-size: 22px;
  line-height: 29px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 225px;
}

.app-view-bot-message-title-unread {
  width: 32px;
  height: 20px;
  background: #45138e;
  border-radius: 100px;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  justify-content: center;
}

.app-view-bot-message-chats {
  padding: 12px;
}

.app-view-user-avatar-circle {
  margin-right: 8px;
  height: 40px;
  width: 40px;
  min-width: 40px;
  min-height: 40px;
  background: linear-gradient(90deg, #03c1fd 0%, #4b0cff 100%);
  border-radius: 50%;
  display: inline-block;
}

.app-view-bot-message-text {
  max-width: 200px;
  font-size: 14px;
  line-height: 18px;
  opacity: 0.5;
}

.app-view-bot-container-timestamp {
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: right;

  color: #ffffff;

  opacity: 0.5;
}

.app-view-bot-container-person-unread {
  min-width: 18px;
  min-height: 18px;
  background: #45138e;
  border-radius: 100px;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  justify-content: center;
  opacity: 0.8;
}

.app-view-max-width {
  width: 100%;
}
</style>
