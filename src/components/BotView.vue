<template lang="pug">
  v-card(flat)
    v-row
      v-col(cols='2')
        v-navigation-drawer(permanent)
          div(v-if='bot.chats' v-for='chat in sortedChats' :key='chat._id')
            v-list-item(@click='openChat(chat)')
              v-list-item-content
                v-list-item-title {{chat.raw.first_name}}
                v-list-item-subtitle(v-if='chat.lastMessage') {{JSON.stringify(chat.lastMessage.raw.text)}}
            v-divider
      v-col(cols='10')
        p(v-if='!chat') Please, select chat
        div(v-else)
          v-text-field(v-model='text')
          v-btn(icon text @click='send')
            v-icon send
          p(v-for='message in chat.messages' :key='message._id') {{message.raw.from.first_name}}: {{message.raw.text}}
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

// Global hack here
declare const sockets: any;

@Component({
  props: {
    bot: Object
  }
})
export default class NoBots extends Vue {
  chat: Chat | null = null;
  text = "";

  get sortedChats() {
    return ((this as any).bot.chats || [] as Chat[]).sort((a: any, b: any) => {
      return new Date(a.lastMessage!.createdAt) <
        new Date(b.lastMessage!.createdAt)
        ? 1
        : -1;
    });
  }

  openChat(chat: Chat) {
    this.chat = chat;
    Vue.set(this.chat, "messages", []);
    sockets.send("request_messages", {
      bot: (this as any).bot._id,
      chat: chat._id
    });
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
