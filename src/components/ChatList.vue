<template lang="pug">
.d-flex.flex-column.app-view-bots-messages-container(@scroll='chatPagination')
  .d-flex.app-view-bot-message-title-container.justify-space-between(
    v-if='!BotsLoading && activeBot && activeBot.name && !this.$vuetify.breakpoint.smAndDown'
  )
    .app-view-bot-message-title-botname {{ activeBot.name }}
    .app-view-bot-message-title-unread {{ activeBot.unread }}
  .app-view-bot-divier(v-if='!this.$vuetify.breakpoint.smAndDown')
  .d-flex.app-view-bot-message-chats.align-center.app-view-bot-container(
    v-for='chat in activeBot.chats',
    :key='chat._id',
    :class='activeChat._id === chat._id ? "app-view-bot-container-active" : ""',
    @click='openChat(chat)'
  )
    .app-view-user-avatar-circle
    .d-flex.flex-column.app-view-bot-container-text.app-view-max-width
      .d-flex.justify-space-between
        .d-flex.app-view-bot-container-text
          .app-view-bot-container-text.app-view-bot-container-text {{ chat.raw.first_name }} {{ chat.raw.last_name }}
        .app-view-bot-container-timestamp.ml-2(v-if='chat.lastMessage') {{ beautifylDate(chat.lastMessage.raw.date) }}
      .d-flex.justify-space-between
        .d-flex
          .app-view-bot-message-text.app-view-bot-container-text.mr-1.chat-list-you(
            v-if='chat.lastMessage && chat.raw.id !== chat.lastMessage.raw.from.id'
          ) {{ $t("you") }}:
          .app-view-bot-message-text.app-view-bot-container-text(
            v-if='chat.lastMessage'
          ) {{ chat.lastMessage.raw.text }}
        .app-view-bot-container-person-unread(v-if='chat.unread > 0') {{ chat.unread > 99 ? "99+" : chat.unread }}
</template>

<script lang="ts">
import { Bot } from '@/models/bot'
import { Chat } from '@/models/chat'
import * as store from '../plugins/store/store'
import { unixToDate } from '@/utils/beautifulDate'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

declare const sockets: any

@Component
export default class ChatList extends Vue {
  @Prop({ required: true }) activeBot!: Bot
  @Prop({ required: true }) BotsLoading!: boolean
  @Prop({ required: true }) activeChat!: Chat
  @Prop({ required: true }) openChat!: (chat: Chat) => void

  chatPagination(e: any) {
    if (e.target.scrollTop === e.target.scrollTopMax) {
      let curbot = this.activeBot as any
      for (const bot of store.bots()) {
        if (bot && bot._id == curbot._id) {
          curbot = bot
        }
      }
      const chats = curbot.chats.length || 0
      Vue.set(curbot, 'chatsloading', true)
      sockets.send('request_chats', {
        bot: curbot._id,
        id: curbot.oldestLoadedChat._id,
      })
    }
  }

  beautifylDate(stamp: number) {
    return unixToDate(stamp)
  }
}
</script>

<style>
@media screen and (max-width: 900px) {
  .app-view-bots-messages-container {
    min-width: 100%;
    max-width: 100%;
  }
  .chat-list-divider {
    margin-bottom: 20px;
  }
}

@media screen and (min-width: 900px) {
  .app-view-bots-messages-container {
    background: #0f0f22;
    min-width: 300px;
    max-width: 300px;
  }
  .app-view-bot-container-active {
    background: #18182b;
  }
}

.app-view-bots-messages-container {
  max-height: 100%;
  overflow-y: auto;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
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

.app-view-bot-container-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-view-bot-divier {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  box-sizing: border-box;
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

.chat-list-you {
  line-height: 18px;
  opacity: 1 !important;
  color: #00bf9d;
}

.app-view-bot-container {
  cursor: pointer;
}
</style>
