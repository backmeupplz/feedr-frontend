<template lang="pug">
  v-card(flat).scrollable
    v-row
      v-col(cols='2').scrollable.scroller
        div(v-if='bot.chats' v-for='chat in sortedChats' :key='chat._id')
          v-list-item(@click='openChat(chat)')
            v-list-item-content
              v-list-item-title {{chat.raw.first_name}}
              v-list-item-subtitle(v-if='chat.lastMessage') {{JSON.stringify(chat.lastMessage.raw.text)}}
          v-divider
      v-divider(vertical)
      v-col(cols='9').pa-0
        v-card(outlined tile)
          v-app-bar(elevation="0")
                  v-tooltip(bottom v-if="chat")
                    template(v-slot:activator='{ on }')
                      span(v-on='on') {{chat.raw.first_name}}
                    span(style="white-space:pre-line;") {{JSON.stringify(chat.raw, undefined, 2)}}
                  v-toolbar-title(v-else) Nothing
                  v-spacer
                  v-menu(left bottom)
                      template(v-slot:activator="{ on }")
                          v-btn(icon v-on="on")
                              v-icon mdi-dots-vertical
                      v-list
                          v-list-item(@click="() => {}")
                              v-list-item-title Заблокировать
                          v-list-item(@click="() => {}")
                              v-list-item-title Разблокировать
        p(v-if='!chat') Please, select chat
        div(v-else)
          ChatComponent(v-bind:messages="sortedMessages" v-bind:bot="bot")
          v-form(v-model="validsend" onSubmit="return false;")
            v-container(justify-center)
              v-text-field(v-model='text' :rules="sendRules" @keypress.enter="send")
                template(v-slot:append)
                  v-btn(icon text @click='send' :disabled="!validsend")
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
import moment from "moment";
import ChatComponent from "./Chat.vue";
// Global hack here
declare const sockets: any;

@Component({
  props: {
    bot: Object
  },
  components: { ChatComponent }
})
export default class NoBots extends Vue {
  chat: Chat | null = null;
  text = "";
  validsend = false;

  get sortedChats() {
    return ((this as any).bot.chats || ([] as Chat[])).sort(
      (a: any, b: any) => {
        if (a.lastMessage && b.lastMessage) {
          return new Date(a.lastMessage!.createdAt) <
            new Date(b.lastMessage!.createdAt)
            ? 1
            : -1;
        }
      }
    );
  }

  get sendRules() {
    return [
      (v: any) => !!v || i18n.t("validation.needtext"),
      (v: any) => v.length <= 4000 || i18n.t("validation.tomuchtext")
    ];
  }

  get sortedMessages() {
    return ((this as any).chat.messages || []).sort((a: any, b: any) => {
      return new Date(a.raw.date * 1000) > new Date(b.raw.date * 1000) ? 1 : -1;
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
    return moment(date * 1000).format("HH:mm:ss");
  }

  formatDateTooltip(date: number) {
    return moment(date * 1000).format("YYYY-MM-DD HH:mm:ss");
  }

  send() {
    if (!this.chat || !this.text) {
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

<style>
.scrollable {
  height: calc(100vh - 112px);
}
.scroller {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>