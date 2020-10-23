<template lang="pug">
.d-flex.flex-column.app-view-bots-messages-container
  .d-flex.app-view-bot-message-title-container.justify-space-between(
    v-if='!BotsLoading && activeBot && activeBot.name'
  )
    .app-view-bot-message-title-botname {{ activeBot.name }}
    .app-view-bot-message-title-unread {{ activeBot.unread }}
  .app-view-bot-divier
  .d-flex.app-view-bot-message-chats.align-center(
    v-for='chat in activeBot.chats'
  )
    .app-view-user-avatar-circle
    .d-flex.flex-column.app-view-bot-container-text.app-view-max-width
      .d-flex.justify-space-between
        .d-flex.justify-space-between.app-view-bot-container-text
          .app-view-bot-container-text.app-view-bot-container-text {{ chat.raw.first_name }} {{ chat.raw.last_name }}
        .app-view-bot-container-timestamp.ml-2 {{ date(chat.lastMessage.raw.date) }}
      .app-view-bot-message-text.app-view-bot-container-text {{ chat.lastMessage.raw.text }}
</template>

<script lang="ts">
import { Bot } from '@/models/bot'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class AllBots extends Vue {
  @Prop({ required: true }) setActiveBot!: (bot: Bot) => void
  @Prop({ required: true }) bots!: Bot[]
}
</script>
