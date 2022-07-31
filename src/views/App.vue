<template lang="pug">
.app-view-main-container
  v-progress-linear(indeterminate, v-if='BotsLoading')
  .app-view-main-container.d-flex
    AllBots(
      :setActiveBot='setActiveBot',
      :activeBot='activeBot',
      v-if='!BotsLoading && !chatSelected'
    )
    ChatList(
      :activeBot='activeBot',
      :BotsLoading='BotsLoading',
      :openChat='openChat',
      :activeChat='activeChat',
      v-if='!chatSelected'
    )
    ChatPreview(
      :chat='activeChat',
      v-if='chatSelected || !this.$vuetify.breakpoint.smAndDown'
    )
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import NoBots from '../components/NoBots.vue'
import BotView from '../components/BotView.vue'
import AllBots from '@/components/AllBots.vue'
import ChatPreview from '@/components/ChatPreview.vue'
import ChatList from '@/components/ChatList.vue'
import * as store from '../plugins/store/store'
import { Bot } from '@/models/bot'
import { Chat } from '@/models/chat'
import { unixToDate } from '@/utils/beautifulDate'
import { Watch } from 'vue-property-decorator'
declare const sockets: any

@Component({
  components: { NoBots, BotView, AllBots, ChatPreview, ChatList },
})
export default class Superpower extends Vue {
  activeBot = store.bots()[0] || ''
  activeChat: Chat | any = ''

  mobileChat = false

  get chatSelected() {
    if (this.$vuetify.breakpoint.smAndDown && store.activeChat()) {
      return true
    }
    return false
  }

  // @Watch('activeChat')
  // chatSelected(val: any, oldVal: any) {
  //   this.mobileChat = this.$vuetify.breakpoint.smAndDown
  // }

  text = ''

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
    store.setActiveChat(true)
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
@media screen and (max-width: 900px) {
  .app-view-main-container {
    flex-direction: column !important;
    width: 100% !important;
    max-height: 100% !important;
  }
}

.app-view-main-container {
  height: 100%;
  max-width: 100%;
}

.app-view-max-width {
  width: 100%;
}
</style>
