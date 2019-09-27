<template lang="pug">
  v-card(flat)
    v-row
      v-col(cols='2')
        div(v-if='bot.chats' v-for='chat in sortedChats' :key='chat._id')
          v-list-item(@click='openChat(chat)')
            v-list-item-content
              v-list-item-title {{chat.raw.first_name}}
              v-list-item-subtitle(v-if='chat.lastMessage') {{JSON.stringify(chat.lastMessage.raw.text)}}
          v-divider
      v-divider(vertical)
      v-col(cols='9' class='pa-4')
        p(v-if='!chat') Please, select chat
        div(v-else)
          v-col(cols='10')
            div(v-for='message in sortedMessages' :key='message._id')
              v-row(v-if='bot.telegramId === message.raw.from.id' justify='end' class='pa-4')
                v-card(width='50%')
                  v-list-item(three-line)
                    v-list-item-content
                      div(class="overline mb-2") {{message.raw.from.first_name}}
                      v-list-item-title(class="mb-3") {{message.raw.text}}
                      v-list-item-subtitle(class="text-right") 
                        v-tooltip(bottom)
                          template(v-slot:activator='{ on }')
                            span(v-on='on') {{formatDate(message.raw.date)}}
                          span {{formatDateTooltip(message.raw.date)}}
              v-row(v-if='bot.telegramId !== message.raw.from.id' justify='start' class='pa-4') 
                v-card(width='50%')
                  v-list-item(three-line)
                    v-list-item-content
                      div(class="overline mb-2") {{message.raw.from.first_name}}
                      v-list-item-title(class="mb-3") {{message.raw.text}}
                      v-list-item-subtitle(class="text-right")
                        v-tooltip(bottom)
                          template(v-slot:activator='{ on }')
                            span(v-on='on') {{formatDate(message.raw.date)}}
                          span {{formatDateTooltip(message.raw.date)}}
          v-row(align='center')
            v-col(cols='10')
              v-text-field(v-model='text')
            v-col(cols='2')
              v-btn(icon text @click='send')
                v-icon send
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
import moment from 'moment';

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
      return new Date(a.lastMessage!.createdAt) < new Date(b.lastMessage!.createdAt) ? 1 : -1;
    });
  }

  get sortedMessages() {
    return ((this as any).chat.messages || []).sort((a: any, b: any) => {
      return new Date(a.raw.date*1000) < new Date(a.raw.date*1000) ? 1 : -1;
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

  formatDate(date: number) {
    return moment(date * 1000).format('HH:mm:ss')
  }

  formatDateTooltip(date: number) {
    return moment(date * 1000).format('YYYY-MM-DD HH:mm:ss')
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
