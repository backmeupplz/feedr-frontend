<template lang="pug">
v-card.message
    v-list-item(three-line)
        v-list-item-content
            div(class="overline mb-2" v-if="!forwardedMessage(message)") {{message.raw.from.first_name}}
            div(class="caption mb-2 blue--text" v-else) Forwarded from: {{forwardedMessageName(message)}}
            TelegramTextMessage(v-if="message.raw.text" v-bind:text="message.raw.text")
            TelegramPhotoMessage(v-else-if="message.raw.photo" v-bind:message="message")
            TelegramUnSupportedMessage(v-else v-bind:message="message")
            v-list-item-subtitle(class="text-right")
                v-tooltip(bottom)
                    template(v-slot:activator='{ on }')
                        span(v-on='on') {{formatDate(message.raw.date)}}
                    span {{formatDateTooltip(message.raw.date)}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store/store";
import { Message } from "../models/message";
import TelegramTextMessage from "./messages/telegram/Text.vue";
import TelegramUnSupportedMessage from "./messages/telegram/UnSupported.vue";
import TelegramPhotoMessage from "./messages/telegram/Photo.vue";
import { i18n } from "../plugins/i18n";
import * as api from "../utils/api";
import moment from "moment";

@Component({
  props: ["message"],
  components: {
    TelegramTextMessage,
    TelegramUnSupportedMessage,
    TelegramPhotoMessage
  }
})
export default class ChatMenu extends Vue {
  formatDate(date: number) {
    return moment(date * 1000).format("HH:mm:ss");
  }

  formatDateTooltip(date: number) {
    return moment(date * 1000).format("YYYY-MM-DD HH:mm:ss");
  }

  forwardedMessage(message: Message) {
    const msg = message.raw;
    if (msg.forward_from || msg.forward_from_chat || msg.forward_sender_name) {
      return true;
    }
    return false;
  }

  forwardedMessageName(message: Message) {
    const msg = message.raw;
    if (msg.forward_from) {
      return msg.forward_from.first_name;
    } else if (msg.forward_from_chat) {
      return msg.forward_from_chat.title;
    } else if (msg.forward_sender_name) {
      return msg.forward_sender_name;
    }
    return "Error";
  }
}
</script>

<style lang="scss">
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