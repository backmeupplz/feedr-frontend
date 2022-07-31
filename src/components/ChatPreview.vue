<template lang="pug">
.d-flex.flex-column.chat-preview-main-container.chat-preview-limit-message-size(
  v-if='chat && chat.messages'
)
  .d-flex.flex-column
    .d-flex.align-self-start.chat-preview-goback-container(
      v-if='$vuetify.breakpoint.smAndDown',
      @click='goBack()'
    )
      img(src='icons/goback.svg')
      .chat-preview-goback {{ $t("goBack") }}
    .d-flex.chat-preview-userbar
      .chat-preview-avatar-circle
      .d-flex.chat-preview-username
        .app-view-bot-container-text {{ chat.raw.first_name }} {{ chat.raw.last_name }}
  .app-view-bot-divier(v-if='!$vuetify.breakpoint.smAndDown')
  .chat-preview-message-area.d-flex.flex-column
    .d-flex.flex-column.chat-preview-messagebox(
      v-for='message in messageInCorrectOrder'
    ) 
      .d-flex.app-view-bot-container-text.chat-preview-message-name(
        :class='isUser(message) ? "align-self-start" : "align-self-end"'
      )
        .app-view-bot-container-text {{ name(message.raw.from.first_name) }} {{ name(message.raw.from.last_name) }}
      .d-flex(:class='isUser(message) ? "align-self-start" : "align-self-end"')
        .d-flex.chat-preview-user-messagebox.align-self-end(
          v-if='message && message.raw.text',
          :class='isUser(message) ? "chat-preview-user-send" : "chat-preview-bot-send"'
        ) {{ message.raw.text }}
        MessageComponent(
          :message='message',
          :class='isUser(message) ? "chat-preview-user-send" : "chat-preview-bot-send"',
          v-else
        )
        .d-flex.align-end.chat-preview-timestamp(
          :class='isUser(message) ? "" : "order-first"'
        ) {{ beautifylDate(message.raw.date) }}
  .chat-preview-send-message-container
    .app-view-bot-divier(v-if='!$vuetify.breakpoint.smAndDown')
    .d-flex.chat-preview-send-message.justify-space-between.align-center
      input.chat-preview-input-field(
        :placeholder='translate("messageInvite")',
        @input='handleText',
        @keypress.enter='send'
      )
      img.chat-preview-send-button(src='/icons/sendMessage.svg', @click='send')
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
import { Prop } from 'vue-property-decorator'
import { unixToDate } from '@/utils/beautifulDate'

// Global hack here
declare const sockets: any

@Component({
  components: { MessageComponent },
})
export default class ChatPreview extends Vue {
  @Prop({ required: true }) chat!: Chat | undefined
  text = ''

  typingCooldown = false
  messageUpdating = false

  get messageInCorrectOrder() {
    return this.chat?.messages?.reverse()
  }

  goBack() {
    store.setActiveChat(false)
  }

  handleText(e: InputEvent) {
    this.text = (e.target as HTMLTextAreaElement).value
  }

  translate(value: string) {
    return i18n.t(value)
  }

  beautifylDate(stamp: number) {
    return unixToDate(stamp)
  }

  isUser(message: Message) {
    return message.raw.from.id === this.chat?.raw.id
  }

  name(name: string) {
    if (!name) {
      return
    }
    return `${name.substr(0, 10)} ${name.length >= 10 ? '...' : ''}`
  }

  send() {
    if (!this.chat || !this.text) {
      return
    }
    sockets.send('send_message', {
      bot: this.chat.bot,
      chat: this.chat._id,
      message: this.text,
      type: this.chat.type,
    })
    this.setTypingCooldown(false)
    this.text = ''
  }

  sendTyping(v: string) {
    if (v) {
      if (this.typingCooldown) {
        return
      }
      this.setTypingCooldown(true)
      this.setTyping()

      const t = this

      setTimeout(() => t.setTypingCooldown(false), 5000)
    }
  }

  setTypingCooldown(a: boolean) {
    this.typingCooldown = a
  }

  setTyping() {
    if (!this.chat) {
      return
    }

    sockets.send('send_typing', {
      bot: this.chat.bot,
      chat: this.chat._id,
      type: this.chat.type,
    })
  }
}
</script>

<style>
@media screen and (max-width: 900px) {
  .chat-preview-main-container {
    width: 100% !important;
    margin-left: 0px !important;
    max-height: 100%;
    min-height: 100%;
    background: none !important;
  }
  .chat-preview-userbar {
    padding: 0px !important;
  }
  .chat-preview-username {
    margin-left: 8px !important;
  }
  .chat-preview-messagebox {
    padding: 16px 0px 16px 0px !important;
  }
  .chat-preview-send-message {
    background: #0f0f22;
  }
}

.chat-preview-main-container {
  background: #0f0f22;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  width: 100%;
  margin-left: 8px;
}

.chat-preview-avatar-circle {
  height: 40px;
  width: 40px;
  min-width: 40px;
  min-height: 40px;
  background: linear-gradient(90deg, #03c1fd 0%, #4b0cff 100%);
  border-radius: 50%;
  display: inline-block;
}

.chat-preview-userbar {
  padding: 10px 24px 10px 24px;
  width: 50vw;
}

.chat-preview-username {
  margin-left: 16px;
  max-width: 40%;
}

.chat-preview-botname {
  font-style: italic;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  /* identical to box height */
  display: flex;
  align-items: center;

  color: #ffffff;

  opacity: 0.4;
}

.chat-preview-user-messagebox {
  min-width: 5%;
}

.chat-preview-user-send {
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.24), 0px 2px 4px rgba(0, 0, 0, 0.16),
    0px -1px 1px rgba(0, 0, 0, 0.08);
  border-radius: 0px 24px 24px 24px;
  padding: 12px 20px 12px 20px;
  background: #1868fb;
}

.chat-preview-bot-send {
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.24), 0px 2px 4px rgba(0, 0, 0, 0.16),
    0px -1px 1px rgba(0, 0, 0, 0.08);
  border-radius: 24px 0px 24px 24px;
  background: rgba(255, 255, 255, 0.16);
  padding: 12px 20px 12px 20px;
}

.chat-preview-messagebox {
  padding: 16px 24px 16px 24px;
}

.chat-preview-message-area {
  overflow-y: auto;
  height: 100%;
  overflow-x: hidden;
}

.chat-preview-message-name {
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;

  /* identical to box height */

  color: #ffffff;

  opacity: 0.6;
  margin-bottom: 8px;
}

.chat-preview-timestamp {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;

  /* identical to box height, or 143% */

  color: #ffffff;

  opacity: 0.4;
  margin-left: 8px;
  margin-right: 8px;
}

.test-field {
  margin: 0 !important;
  padding: 0 !important;
}

.chat-preview-input-field {
  font-family: Source Sans Pro;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;

  color: #ffffff;
  width: 100%;
  margin: 0px 18px 0px 18px;
}

.chat-preview-input-field:focus {
  border: none !important;
}

.chat-preview-input-field::placeholder {
  opacity: 0.3;
}

.chat-preview-send-message {
  padding: 20px;
  min-height: 60px;
  max-height: 60px;
}

.chat-preview-send-button {
  cursor: pointer;
}

.chat-preview-limit-message-size {
  max-width: 100%;
}

.test-test {
  max-width: 50% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.chat-preview-user-messagebox {
  overflow-wrap: anywhere;
}

.chat-preview-goback {
  margin-left: 8px;
  font-size: 15px;
  line-height: 22px;

  /* identical to box height, or 147% */
  display: flex;
  align-items: center;
  letter-spacing: -0.4px;
}

.chat-preview-goback-container {
  opacity: 0.4;
  margin-bottom: 28px;
}
</style>
