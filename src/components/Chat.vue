<template lang="pug">
    v-col(cols='12').columner
            div(v-for='message in messages' :key='message._id')
              v-row(v-if='bot.telegramId === message.raw.from.id' justify='end' class='pa-4')
                v-card.message
                  v-list-item(three-line)
                    v-list-item-content
                      div(class="overline mb-2") {{message.raw.from.first_name}}
                      v-list-item-title(class="mb-3").message-text {{message.raw.text}}
                      v-list-item-subtitle(class="text-right") 
                        v-tooltip(bottom)
                          template(v-slot:activator='{ on }')
                            span(v-on='on') {{formatDate(message.raw.date)}}
                          span {{formatDateTooltip(message.raw.date)}}
              v-row(v-if='bot.telegramId !== message.raw.from.id' justify='start' class='pa-4') 
                v-card.message
                  v-list-item(three-line)
                    v-list-item-content
                      div(class="overline mb-2") {{message.raw.from.first_name}}
                      v-list-item-title(class="mb-3").message-text {{message.raw.text}}
                      v-list-item-subtitle(class="text-right")
                        v-tooltip(bottom)
                          template(v-slot:activator='{ on }')
                            span(v-on='on') {{formatDate(message.raw.date)}}
                          span {{formatDateTooltip(message.raw.date)}}
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
// Global hack here
declare const sockets: any;

@Component({
  props: {
    bot: Object,
    messages: Array
  },
  updated() {
    var elem = this.$el;
    elem.scrollTop = elem.scrollHeight;
  }
})
export default class ChatComponent extends Vue {
  chat: Chat | null = null;
  text = "";

  formatDate(date: number) {
    return moment(date * 1000).format("HH:mm:ss");
  }

  formatDateTooltip(date: number) {
    return moment(date * 1000).format("YYYY-MM-DD HH:mm:ss");
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
.message {
  max-width: 50% !important;
  display: inline-block !important;
}
.message-text {
  white-space: normal !important;
  -moz-user-select: text !important;
  -khtml-user-select: text !important;
  user-select: text !important;
}
</style>