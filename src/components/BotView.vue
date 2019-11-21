<template lang="pug">
  v-card(flat height="100vh")
    v-row
      v-col(cols='0' sm='3' md="2" v-if='!mobile').scrollable.scroller
        div(v-if='bot.chats' v-for='chat in sortedChats' :key='chat._id')
          v-list-item(@click='openChat(chat)')
            v-list-item-content
              v-list-item-title {{chat.raw.first_name}}
              v-list-item-subtitle(v-if='chat.lastMessage') {{JSON.stringify(chat.lastMessage.raw.text)}}
          v-divider
      v-divider(vertical v-if='!mobile')
      v-col(cols='12' sm="8" md="9" :class="{'pa-4': $vuetify.breakpoint.xsOnly, 'pa-0': $vuetify.breakpoint.smAndUp}")
        v-navigation-drawer(v-model="chatnav" absolute temporary v-if="mobile")
          v-list(nav)
              v-list-item-title {{$t('chatlist')}}:
              v-list-item-group(active-class="text--accent-8")
                div(v-if='bot.chats' v-for='chat in sortedChats' :key='chat._id')
                  v-list-item(@click='openChat(chat); chatnav = !chatnav')
                      v-list-item-title {{chat.raw.first_name}}
                          v-list-item-subtitle(v-if='chat.lastMessage') {{JSON.stringify(chat.lastMessage.raw.text)}}
        v-card(outlined tile)
          v-app-bar(elevation="0")
            v-app-bar-nav-icon(@click.stop="chatnav = !chatnav" v-if="mobile")
            v-tooltip(bottom v-if="chat")
              template(v-slot:activator='{ on }')
                span(v-on='on') {{chat.raw.first_name}}
              span(style="white-space:pre-line;") {{JSON.stringify(chat.raw, undefined, 2)}}
            v-toolbar-title(v-else) Nothing
            v-spacer
            v-chip(v-if="chat && chat.banned" color="red" text-color="white") {{$t('chat.banned')}}
            ChatMenu(v-bind:chat="chat")
        p(v-if='!chat') Please, select chat
        div(:style="wrapperHeight" v-else)
          ChatComponent(v-bind:bot="bot" v-bind:curchat="chat")
          v-form(v-model="validsend" ref="msgSendForm" onSubmit="return false;")
            v-container(justify-center)
              v-text-field(v-model='text' ref="inputMsg" :rules="sendRules" @keypress.enter="send")
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
import ChatMenu from "./ChatMenu.vue";
// Global hack here
declare const sockets: any;

@Component({
  props: {
    bot: Object
  },
  components: { ChatComponent, ChatMenu }
})
export default class BotView extends Vue {
  chat: Chat | null = null;
  text = "";
  validsend = false;
  chatnav = false;
  winheight = 0;

  $refs!: Vue["$refs"] & {
    msgSendForm: any;
    inputMsg: any;
  };

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

  get heightStyle() {
    let height = this.winheight - 120;
    return { height: height + "px" };
  }

  WindowHeight(data: any) {
    this.winheight = data.target.innerHeight;
  }

  mounted() {
    this.winheight = window.innerHeight;
    this.$nextTick(function() {
      window.addEventListener("resize", this.WindowHeight);
    });
  }

  get wrapperHeight() {
    let height = this.winheight - 120 - 160;
    return { height: height + "px" };
  }

  get sendRules() {
    return [
      (v: any) => !!v || '',
      (v: any) => ((v && v.length) <= 4000 || !v) || i18n.t("validation.tomuchtext")
    ];
  }

  openChat(chat: Chat) {
    this.chat = chat;
    Vue.set(this.chat, "messages", []);
    sockets.send("request_messages", {
      bot: (this as any).bot._id,
      chat: chat._id
    });
  }

  get mobile() {
    return this.$vuetify.breakpoint.xsOnly;
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
    this.$refs.msgSendForm.reset();
    this.$refs.inputMsg.blur();
  }
}
</script>

<style>
.scrollable {
  height: calc(100vh - 120px);
}
.scroller {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
