<template lang="pug">
v-card.message
    v-list-item(three-line)
        v-list-item-content
            div(class="overline mb-2" v-if="!forwardedMessage(message)") {{(message.raw.from && message.raw.from.first_name) || (message.raw.name)}}
            v-dialog(v-model="modalForwarded" persistent width="500" v-else)
              template(v-slot:activator="{on}")
                div(class="caption mb-2 blue--text" style="cursor: pointer;" @click.stop="modalForwarded = true") {{$t('forwarded_message.forwarded_from')}} {{forwardedMessageName(message)}}
              v-card
                v-card-title {{forwardedMessageName(message)}} 
                v-card-text(v-if="message.raw.forward_from_chat && message.raw.forward_from_chat.username") 
                  |Username: 
                  a(target="_blank" :href="`https://t.me/${message.raw.forward_from_chat.username}`")
                    |@{{message.raw.forward_from_chat.username}}
                v-card-text(v-else-if="message.raw.forward_from && message.raw.forward_from.username") 
                  |Username: 
                  a(target="_blank" :href="`https://t.me/${message.raw.forward_from.username}`")
                    |@{{message.raw.forward_from.username}}
                v-card-text(v-else) {{forwardedMessageUsernameExceptions(message)}}
                v-card-actions
                  v-spacer
                  v-btn(color='blue'
                  text 
                  @click='modalForwarded = false') {{$t('close')}}
            div(v-if="telegram")
              // Simple text
              TextMessage(v-if="message.raw.text" :message="message")
              // Photo
              TelegramPhotoMessage(v-else-if="message.raw.photo" :message="message")
              // Video, Telescope Video and Animation
              TelegramVideoMessage(v-else-if="message.raw.video || message.raw.video_note || message.raw.animation" :message="message")
              // Location and Venue
              TelegramLocationMessage(v-else-if="message.raw.location" :message="message.raw")
              // Polls
              TelegramPollMessage(v-else-if="message.raw.poll" :message="message.raw")
              // Sticker
              TelegramStickerMessage(v-else-if="message.raw.sticker" :message="message")
              // Document
              TelegramDocumentMessage(v-else-if="message.raw.document && !message.raw.animation" :message="message")
              // Contact
              TelegramContactMessage(v-else-if="message.raw.contact" :message="message")
              // Audio and Voice
              TelegramAudioMessage(v-else-if="message.raw.audio || message.raw.voice" :message="message")
              // Game
              TelegramGameMessage(v-else-if="message.raw.game" :game="message.raw.game")
              // Unsupported Messages
              UnSupportedMessage(v-else :message="message")
            div(v-else="viber")
              // Simple text
              TextMessage(v-if="message.raw.type === 'text'" :text="message.raw.text")
              // Location
              ViberLocationMessage(v-else-if="message.raw.location" :message="message.raw")
              // Picture
              ViberPhotoMessage(v-else-if="message.raw.type === 'picture'" :message="message")
              // Contact
              ViberContactMessage(v-else-if="message.raw.type === 'contact'" :message="message")
              // Video
              ViberVideoMessage(v-else-if="message.raw.type === 'video'" :message="message")
              // Sticker
              ViberStickerMessage(v-else-if="message.raw.type === 'sticker'" :message="message")
              // File
              ViberDocumentMessage(v-else-if="message.raw.type === 'file'" :message="message")
              // URL Message
              TextMessage(v-else-if="message.raw.type === 'url'" :text="'URL: ' + message.raw.media")
              // Unsupported Messages
              UnSupportedMessage(v-else :message="message")

            v-list-item-subtitle(class="text-right")
                v-tooltip(bottom)
                    template(v-slot:activator='{ on }')
                        span(v-on='on') {{formatDate(message)}}
                    span {{formatDateTooltip(message)}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store/store'
import { Message } from '../models/message'
import TextMessage from './messages/telegram/Text.vue' // Text message type
import UnSupportedMessage from './messages/telegram/UnSupported.vue' // Unsupported
// TG
import TelegramPhotoMessage from './messages/telegram/Photo.vue' // Photo message type
import TelegramVideoMessage from './messages/telegram/Video.vue' // Video, Telescope and Animation message types
import TelegramLocationMessage from './messages/telegram/Location.vue' // Location and Venue messages types
import TelegramPollMessage from './messages/telegram/Poll.vue' // Poll message type
import TelegramStickerMessage from './messages/telegram/Sticker.vue' // Sticker message type
import TelegramDocumentMessage from './messages/telegram/Document.vue' // Document message type
import TelegramContactMessage from './messages/telegram/Contact.vue' // Contact message type
import TelegramAudioMessage from './messages/telegram/Audio.vue' // Audio message type
import TelegramGameMessage from './messages/telegram/Game.vue' // Game message type
// VIBER
import ViberLocationMessage from './messages/viber/Location.vue' // Location message type
import ViberPhotoMessage from './messages/viber/Photo.vue' // Photo message type
import ViberContactMessage from './messages/viber/Contact.vue' // Contact message type
import ViberVideoMessage from './messages/viber/Video.vue' // Video, Telescope and Animation message types
import ViberDocumentMessage from './messages/viber/Document.vue' // Contact message type
import ViberStickerMessage from './messages/viber/Sticker.vue' // Video, Telescope and Animation message types

import { i18n } from '../plugins/i18n'
import * as api from '../utils/api'
import moment from 'moment'

@Component({
  props: ['message'],
  components: {
    TextMessage,
    UnSupportedMessage,
    TelegramPhotoMessage,
    TelegramVideoMessage,
    TelegramLocationMessage,
    TelegramStickerMessage,
    TelegramDocumentMessage,
    TelegramContactMessage,
    TelegramAudioMessage,
    TelegramPollMessage,
    TelegramGameMessage,
    ViberLocationMessage,
    ViberPhotoMessage,
    ViberContactMessage,
    ViberVideoMessage,
    ViberDocumentMessage,
    ViberStickerMessage,
  },
})
export default class ChatMenu extends Vue {
  modalForwarded = false

  get telegram() {
    return this.$props.message.type === 'telegram'
  }
  formatDate(message: any) {
    let date: number
    if (message.type === 'viber') {
      return moment(message.createdAt).format('HH:mm:ss')
    }
    return moment(message.raw.date * 1000).format('HH:mm:ss')
  }

  formatDateTooltip(message: any) {
    let date: number
    if (message.type === 'viber') {
      return moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }
    return moment(message.raw.date * 1000).format('YYYY-MM-DD HH:mm:ss')
  }

  forwardedMessage(message: Message) {
    const msg = message.raw
    if (msg.forward_from || msg.forward_from_chat || msg.forward_sender_name) {
      return true
    }
    return false
  }

  forwardedMessageUsernameExceptions(message: Message) {
    if (message.raw.forward_sender_name) {
      return i18n.t('forwarded_message.user_hidden')
    } else if (
      message.raw.forward_from_chat &&
      message.raw.forward_from_chat.type === 'channel'
    ) {
      return i18n.t('forwarded_message.channel_private')
    } else if (
      message.raw.forward_from_chat &&
      (message.raw.forward_from_chat.type === 'group' ||
        message.raw.forward_from.chat.type === 'supergroup')
    ) {
      return i18n.t('forwarded_message.group_private')
    } else if (
      message.raw.forward_from_chat &&
      message.raw.forward_from_chat.type === 'private'
    ) {
      return i18n.t('forwarded_message.no_username')
    }
    return 'Username uncaught parsing error'
  }

  forwardedMessageName(message: Message) {
    const msg = message.raw
    if (msg.forward_from) {
      const last_name = msg.forward_from.last_name || ''
      return msg.forward_from.first_name + ' ' + last_name
    } else if (msg.forward_from_chat) {
      return msg.forward_from_chat.title
    } else if (msg.forward_sender_name) {
      return msg.forward_sender_name
    }
    return 'Error'
  }
}
</script>

<style lang="scss">
.message {
  max-width: 75% !important;
  display: inline-block !important;
}
.message-text {
  white-space: break-spaces !important;
  overflow-wrap: anywhere !important;
  user-select: text !important;
}
</style>