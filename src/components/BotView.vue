<template lang="pug">
  v-card(flat height="100vh" style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%")
    v-row.pr-1
      v-col(cols='0' sm='4' md="3" lg='2' v-if='!mobile').scrollable.scroller.border__top
        div(v-if='bot.chats' v-for='(chat, i) in sortedChats' :key='chat._id' v-observe-visibility='(isVisible, entry) => visibilityChanged(isVisible, entry, i)')
          v-list-item(@click='openChat(chat)' @click.prevent="setMessageSendFocus" active-class="active" :class="{'v-list-item--active': chatActivated(chat)}" )
            v-list-item-content
              v-list-item-title {{getChatName(chat).name}}
              v-list-item-subtitle(v-if='chat.lastMessage')
                i {{frombot(curbot, chat.lastMessage)}}
                |{{chat.lastMessage.raw.text || $t('chat.attachment')}}
              v-list-item-subtitle(v-if="curbot.botType === 'feed'") 
                i {{$t('bot.bot')}}:&nbsp;
                | {{getBotName(chat)}}
                v-icon(x-small v-if="getBotType(chat) === 'viber'") mdi-phone-in-talk
                v-icon(x-small v-else-if="getBotType(chat) === 'telegram'") mdi-telegram
            v-list-item-action()
              v-list-item-action-text(v-if='chat.lastMessage' v-text="formatDateHM(new Date(chat.lastMessage.updatedAt))")
              v-list-item-action-text.count-badge(v-if="chat.unread") {{chat.unread}}
          v-divider
      v-col(cols='12' sm="8" md="9" lg='10' :class="{'pa-4': $vuetify.breakpoint.xsOnly, 'pa-0 pr-4 chatview': $vuetify.breakpoint.smAndUp}")
        v-navigation-drawer(v-model="chatnav" absolute temporary v-if="mobile" :style="listStyle")
          v-list(nav two-line)
            v-list-item-title {{$t('chatlist')}}:
            v-list-item-group(active-class="text--accent-8")
              div(v-if='bot.chats' v-for='(chat, i) in sortedChats' :key='chat._id' v-observe-visibility='(isVisible, entry) => visibilityChanged(isVisible, entry, i)')
                v-list-item(@click='openChat(chat); chatnav = !chatnav' @click.prevent="setMessageSendFocus" active-class="active" :class="{'v-list-item--active': chatActivated(chat, selectedChat)}") 
                  v-list-item-content
                    v-list-item-title {{getChatName(chat).name}}
                    v-list-item-subtitle(v-if='chat.lastMessage') 
                      i {{frombot(curbot, chat.lastMessage)}}
                      |{{chat.lastMessage.raw.text || $t('chat.attachment')}}
                    v-list-item-subtitle(v-if="curbot.botType === 'feed'") 
                      i {{$t('bot.bot')}}:&nbsp;
                      | {{getBotName(chat)}}
                      v-icon(x-small v-if="getBotType(chat) === 'viber'") mdi-phone-in-talk
                      v-icon(x-small v-else-if="getBotType(chat) === 'telegram'") mdi-telegram                    
                  v-list-item-action(v-if='chat.lastMessage')
                    v-list-item-action-text(v-text="formatDateHM(new Date(chat.lastMessage.updatedAt))")
                    v-list-item-action-text.count-badge(v-if="chat.unread") {{chat.unread}}
        v-card(outlined tile)
          v-app-bar(elevation="0")
            v-app-bar-nav-icon(@click.stop="chatnav = !chatnav" v-if="mobile")
            v-tooltip(bottom v-if="chat")
              template(v-slot:activator='{ on }')
                span(v-on='on') 
                  span(v-if="getChatName(chat).type === 'feed'")
                    i {{getChatName(chat).botName}}
                    |&nbsp;
                    v-icon(small v-if="getChatName(chat).botType === 'viber'") mdi-phone-in-talk
                    v-icon(small v-else-if="getChatName(chat).botType === 'telegram'") mdi-telegram
                    |&nbsp;|
                    | {{getChatName(chat).name}}
                  span(v-else) {{getChatName(chat).name}}
              span(style="white-space:pre-line;") {{JSON.stringify(chat.raw, undefined, 2)}}
            v-spacer
            ChatMenu(v-bind:chat="selectedChat")
          v-progress-linear(indeterminate v-if="chatloading")
        .headline.pa-4.text-center(v-if='!chat && curbot && curbot.chats && curbot.chats.length') {{$t('chat.select')}}
        .headline.pa-4.text-center(v-else-if='!chat && curbot && !curbot.chats.length && curbot.botType !== "feed"') {{$t('chat.invite')}} 
          a(v-if="bot.botType ==='telegram'" :href="'https://t.me/' + curbot.username" target="_blank")   
            |@{{curbot.username}}
          div(v-else)
            |@{{curbot.username}}
        .headline.pa-4.text-center(v-else-if="curbot.chats && !curbot.chats.length && curbot.botType === 'feed'") 
          div(v-if="$store.state.bots.length > 1") {{$t('chat.nochats')}}
          div(v-else) {{$t('noBots')}}
        v-container(v-else style="max-width: 100% !important").border__right.border__left
          v-row
            ChatComponent(v-bind:bot="bot" :style="wrapperHeight" v-bind:curchat="selectedChat")
          v-row
            v-form(style="width: 100%" v-model="validsend" ref="msgSendForm" onSubmit="return false;")
              v-container(justify-center style="max-width: 100% !important")
                v-text-field(v-model='text' ref="inputMsg" :rules="sendRules" @keypress.enter="send")
                  template(v-slot:append)
                    v-btn(icon text @click='send' :disabled="!validsend")
                      v-icon send
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
import moment from 'moment'
import ChatComponent from './Chat.vue'
import ChatMenu from './ChatMenu.vue'
import Checkout from './Checkout.vue'
// Global hack here
declare const sockets: any

@Component({
  props: {
    bot: Object,
  },
  components: { ChatComponent, ChatMenu, Checkout },
})
export default class BotView extends Vue {
  chat: Chat | null = null
  text = ''
  validsend = false
  chatnav = false
  winheight = 0

  $refs!: Vue['$refs'] & {
    msgSendForm: any
    inputMsg: any
  }

  getBotName(chat: Chat) {
    for (const bot of store.bots()) {
      if (chat.bot === bot._id.toString()) {
        return bot.name
      }
    }
  }

  getBotType(chat: Chat) {
    for (const bot of store.bots()) {
      if (chat.bot === bot._id.toString()) {
        return bot.botType
      }
    }
  }

  updated() {
    let unread = false
    for (const bot of store.bots()) {
      if (bot.unread) {
        unread = true
      }
    }
    if (unread) {
      ;(document as any).getElementById('favicon').href = './icons/circle.png'
    } else {
      ;(document as any).getElementById('favicon').href = './icons/feedr.png'
    }
  }

  visibilityChanged(isVisible: Boolean, entry: any, i: number, chat: Chat) {
    let curbot = this.curbot as any
    for (const bot of store.bots()) {
      if (bot && bot._id == curbot._id) {
        curbot = bot
      }
    }
    if (
      !isVisible ||
      curbot.no_more_chats ||
      curbot.chatsloading ||
      !curbot.oldestLoadedChat
    ) {
      return
    }
    const chats = curbot.chats.length || 0
    const qty = i + 1
    if (qty === chats) {
      Vue.set(curbot, 'chatsloading', true)
      sockets.send('request_chats', {
        bot: curbot._id,
        id: curbot.oldestLoadedChat._id,
      })
    }
  }

  frombot(bot: any, message: any) {
    if (bot.botType === 'telegram') {
      if (bot.telegramId === message.raw.from.id) {
        return `${i18n.t('you')}: `
      }
      return ''
    }
    if (bot.botType === 'viber') {
      if (message.frombot) {
        return `${i18n.t('you')}: `
      }
      return ''
    }
  }

  getChatName(chat: Chat) {
    if ((this as any).curbot.botType === 'feed') {
      for (const bot of store.bots()) {
        if (bot._id == chat.bot) {
          let name = ''
          if (chat.raw.name) {
            name = chat.raw.name
            return {
              type: 'feed',
              botType: bot.botType,
              name,
              botName: bot.name,
            }
          }
          if (chat.raw.first_name) {
            name = chat.raw.first_name
          }
          if (chat.raw.last_name) {
            name = `${name} ${chat.raw.last_name}`
          }
          return { type: 'feed', botType: bot.botType, name, botName: bot.name }
        }
      }
    }
    if (chat.raw.name) {
      return { type: 'default', name: chat.raw.name }
    }
    let name = ''
    if (chat.raw.first_name) {
      name = chat.raw.first_name
    }
    if (chat.raw.last_name) {
      name = `${name} ${chat.raw.last_name}`
    }
    if (!name) {
      return i18n.t('chat.noname')
    }

    return { type: 'default', name }
  }

  get selectedChat() {
    for (const bot of store.bots()) {
      if (bot && bot._id === this.$props.bot._id && bot.selected_chat) {
        this.openChat(bot.selected_chat)
        for (const chats of (bot as any).chats) {
          if (chats._id === bot.selected_chat._id) {
            return chats
          }
        }
      } else if (
        bot &&
        bot._id === this.$props.bot._id &&
        !bot.selected_chat &&
        this.chat
      ) {
        this.openChat(this.chat)
        return this.chat
      }
    }
  }

  get curbot() {
    for (const bot of store.bots()) {
      if (bot && bot._id == this.$props.bot._id) {
        return bot
      }
    }
  }

  get chatloading() {
    return store.chatLoading()
  }
  get sortedChats() {
    for (const bot of store.bots()) {
      if (bot && bot._id === this.$props.bot._id) {
        if (bot.chats) {
          return bot.chats.sort((a: Chat, b: Chat) => {
            if (a.lastMessage && b.lastMessage) {
              return new Date(a.lastMessage!.createdAt) <
                new Date(b.lastMessage!.createdAt)
                ? 1
                : -1
            } else if (a.lastMessage && !b.lastMessage) {
              return new Date(a.lastMessage!.createdAt) < new Date(b.updatedAt)
                ? 1
                : -1
            } else if (!a.lastMessage && b.lastMessage) {
              return new Date(a.updatedAt) < new Date(b.lastMessage!.createdAt)
                ? 1
                : -1
            } else if (!a.lastMessage && !b.lastMessage) {
              return new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1
            }
            return 0
          })
        }
      }
    }
  }

  chatActivated(chat: Chat) {
    if (!chat) {
      return false
    }
    if (this.selectedChat && this.selectedChat._id === chat._id) {
      return true
    }
    return false
  }

  get heightStyle() {
    let height = this.winheight - 120
    return { height: height + 'px' }
  }

  get listStyle() {
    let height = this.winheight - 100
    return { height: height + 'px' }
  }

  WindowHeight(data: any) {
    this.winheight = data.target.innerHeight
  }

  mounted() {
    this.winheight = window.innerHeight
    this.$nextTick(function() {
      window.addEventListener('resize', this.WindowHeight)
    })
  }

  get wrapperHeight() {
    let height = this.winheight - 120 - 160
    return { height: height + 'px', position: 'absoulte' }
  }

  get sendRules() {
    return [
      (v: any) => !!v || '',
      (v: any) =>
        (v && v.length) <= 4000 || !v || i18n.t('validation.tomuchtext'),
    ]
  }

  openChat(chat: Chat) {
    const date = Number(new Date())
    if (this.chat) {
      if (this.chat._id === chat._id) {
        return
      }
    }
    if (this.chat && this.chat._id !== chat._id) {
      Vue.set(this.chat, 'messages', [])
    }

    this.chat = chat
    for (const bot of store.bots()) {
      if (bot && bot._id === this.$props.bot._id) {
        Vue.set(chat, 'messages', [])
        Vue.set(bot, 'selected_chat', chat)
      }
    }
    if (
      !(this.chat.messages && this.chat.messages.length) &&
      !store.chatLoading()
    ) {
      store.setChatLoading(true)
      Vue.set(this.chat, 'messages', [])
      sockets.send('request_messages', {
        bot: chat.bot,
        chat: chat._id,
      })
    }
  }

  setMessageSendFocus() {
    if (this.mobile) {
      return
    }
    if (this.$refs.inputMsg) {
      this.$refs.msgSendForm.reset()
      this.$refs.inputMsg.focus()
    } else {
      let that = this
      setTimeout(function() {
        that.$refs.msgSendForm.reset()
        that.$refs.inputMsg.focus()
      }, 150)
    }
  }

  get mobile() {
    return this.$vuetify.breakpoint.xsOnly
  }

  formatDate(date: number) {
    return moment(date * 1000).format('HH:mm:ss')
  }

  formatDateHM(date: number) {
    return moment(date).format('HH:mm')
  }

  formatDateTooltip(date: number) {
    return moment(date * 1000).format('YYYY-MM-DD HH:mm:ss')
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
    this.$refs.msgSendForm.reset()
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

/* .border__top */
.theme--light .border__top {
  border-top: 1px solid #e0e0e0;
}
.theme--dark .border__top {
  border-top: 1px solid #595959;
}
/* .border__right */
.theme--light .border__right {
  border-right: 1px solid #e0e0e0;
}
.theme--dark .border__right {
  border-right: 1px solid #595959;
}
/* .border__left */
.theme--light .border__left {
  border-left: 1px solid #e0e0e0;
}
.theme--dark .border__left {
  border-left: 1px solid #595959;
}
/* .chatview */
.theme--light .chatview {
  border-left: 1px solid #e0e0e0;
}

.theme--dark .chatview {
  border-left: 1px solid #595959;
}
/* .indigo--text */
.theme--dark.v-btn.indigo--text {
  color: #e0e0e0 !important;
  caret-color: #e0e0e0 !important;
}
</style>
