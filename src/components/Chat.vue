<template lang="pug">
    v-col(cols='12').columner
            div(v-for='(message, i) in messages' :key='message._id' v-observe-visibility='(isVisible, entry) => visibilityChanged(isVisible, entry, i, message, bot)')
              v-row(v-if='bot.telegramId === message.raw.from.id' justify='end' class='pa-4')
                MessageComponent(v-bind:message="message")
              v-row(v-if='bot.telegramId !== message.raw.from.id' justify='start' class='pa-4') 
                MessageComponent(v-bind:message="message")
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AddBotDialog from "./AddBotDialog.vue";
import * as api from "../utils/api";
import { Bot } from "../models/bot";
import * as store from "../plugins/store/store";
import { i18n } from "../plugins/i18n";
import { Chat } from "../models/chat";
import MessageComponent from "./Message.vue";
import moment from "moment";
import { Message } from "../models/message";
// Global hack here
declare const sockets: any;

@Component({
  components: { MessageComponent },
  props: {
    bot: Object,
    messages: Array
  }
})
export default class ChatComponent extends Vue {
  chat: Chat | null = null;
  text = "";
  messageUpdating = true;
  noMoreMessages = false;
  scroll = true;

  setUpdating() {
    this.messageUpdating = false;
  }

  setScroll() {
    this.scroll = true;
  }

  updated() {
    this.$nextTick(() => {
      this.messageUpdating = true;
      this.noMoreMessages = false;
      if (this.scroll) {
        let elem = this.$el;
        elem.scrollTop = 100000;
      }
      setTimeout(this.setUpdating, 100);
    });
  }

  async visibilityChanged(
    isVisible: Boolean,
    entry: any,
    sectionIndex: number,
    message: Message,
    bot: Bot
  ) {
    if (!isVisible) {
      return;
    }
    if (this.noMoreMessages || this.messageUpdating) {
      return;
    }
    if (sectionIndex == 0) {
      this.loadMessages(message, bot);
    }
  }

  async loadMessages(lastmessage: Message, curbot: Bot) {
    if (this.messageUpdating) {
      return;
    }
    try {
      this.messageUpdating = true;
      const fetchedMessages = await api.getMessages(lastmessage);
      if (fetchedMessages.length <= 1) {
        return (this.noMoreMessages = true);
      }
      for (const bot of store.bots()) {
        if (bot._id === curbot._id) {
          for (const curchat of bot.chats || []) {
            if (lastmessage.chat === curchat._id) {
              Vue.set(curchat, "messages", [
                ...fetchedMessages,
                ...(curchat.messages || [])
              ]);
              return;
            }
          }
          return;
        }
      }
    } catch (err) {
      store.setSnackbarError("errors.loadMessages");
    } finally {
      this.messageUpdating = false;
      this.scroll = false;
      setTimeout(this.setScroll, 200);
    }
  }

  send() {
    if (!this.chat) {
      return;
    }
    sockets.send("send_message", {
      bot: (this as any).bot._id,
      chat: this.chat._id,
      message: this.text
    });
    this.text = "";
  }
}
</script>

<style lang="scss">
.columner {
  height: calc(100vh - 297px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>