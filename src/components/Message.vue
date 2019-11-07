<template lang="pug">
v-card.message
    v-list-item(three-line)
        v-list-item-content
            div(class="overline mb-2" v-if="!forwardedMessage(message)") {{message.raw.from.first_name}}
            div(class="caption mb-2 blue--text" v-else) Forwarded from: {{forwardedMessageName(message)}}
            // Just text
            TelegramTextMessage(v-if="message.raw.text" v-bind:text="message.raw.text")
            // Photo
            TelegramPhotoMessage(v-else-if="message.raw.photo" v-bind:message="message")
            // Video, Telescope Video and Animation
            TelegramVideoMessage(v-else-if="message.raw.video || message.raw.video_note || message.raw.animation" v-bind:message="message")
            // Location and Venue
            TelegramLocationMessage(v-else-if="message.raw.location" v-bind:message="message.raw")
            // Polls
            TelegramPollMessage(v-else-if="message.raw.poll" v-bind:message="message.raw")
            // Sticker
            TelegramStickerMessage(v-else-if="message.raw.sticker" v-bind:message="message")
            // Document
            TelegramDocumentMessage(v-else-if="message.raw.document && !message.raw.animation" v-bind:message="message")
            // Contact
            TelegramContactMessage(v-else-if="message.raw.contact" v-bind:message="message")
            // Audio and Voice
            TelegramAudioMessage(v-else-if="message.raw.audio || message.raw.voice" v-bind:message="message")
            // Unsupported Messages
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
import TelegramUnSupportedMessage from "./messages/telegram/UnSupported.vue"; // Text message type
import TelegramPhotoMessage from "./messages/telegram/Photo.vue"; // Photo message type
import TelegramVideoMessage from "./messages/telegram/Video.vue"; // Video, Telescope and Animation message types
import TelegramLocationMessage from "./messages/telegram/Location.vue"; // Location and Venue messages types
import TelegramPollMessage from "./messages/telegram/Poll.vue"; // Poll message type
import TelegramStickerMessage from "./messages/telegram/Sticker.vue"; // Sticker message type
import TelegramDocumentMessage from "./messages/telegram/Document.vue"; // Document message type
import TelegramContactMessage from "./messages/telegram/Contact.vue"; // Contact message type
import TelegramAudioMessage from "./messages/telegram/Audio.vue"; // Audio message type

import { i18n } from "../plugins/i18n";
import * as api from "../utils/api";
import moment from "moment";

@Component({
  props: ["message"],
  components: {
    TelegramTextMessage,
    TelegramUnSupportedMessage,
    TelegramPhotoMessage,
    TelegramVideoMessage,
    TelegramLocationMessage,
    TelegramStickerMessage,
    TelegramDocumentMessage,
    TelegramContactMessage,
    TelegramAudioMessage,
    TelegramPollMessage
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
  max-width: 75% !important;
  display: inline-block !important;
}
.message-text {
  white-space: normal !important;
  -moz-user-select: text !important;
  -khtml-user-select: text !important;
  user-select: text !important;
}
</style>