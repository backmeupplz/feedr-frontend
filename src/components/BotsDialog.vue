<template lang="pug">
  div
    AddBotDialog(:dialog='addBotDialog'
    :close='closeAddBotDialog')
    v-dialog(v-model='dialog' fullscreen persistent hide-overlay scrollable)
      v-card
        nav
          v-toolbar(dark flat)
            v-app-bar-nav-icon(@click.stop="settingsNav = !settingsNav" v-if="mobile")
            v-toolbar-title {{$t('botList.title')}}
            v-spacer
            v-toolbar-items
              v-btn(icon
              :loading='loading'
              @click='updateList')
                v-icon refresh
              v-btn(dark text @click='close' @click.stop='setDefault') Закрыть
        v-progress-linear(indeterminate v-if="loading")
        v-row(no-gutters)
          v-col(cols='0' sm='4' md="3" v-if='!mobile').border__right.border__top
            v-list(dense)
              v-list-group(no-action v-for='bot in $store.state.bots' :key='bot._id' v-if="bot.botType !== 'feed'")
                template(v-slot:activator)
                    v-list-item-icon 
                      v-icon {{getIcon(bot.botType)}}
                    v-list-item-content
                      v-list-item-title  {{bot.name}}
                v-list-item(@click="openTab(bot, 'about');" :disabled="loading")
                  v-list-item-icon
                    v-icon mdi-information
                  v-list-item-title {{$t('bot.about')}}
                v-list-item(@click="openTab(bot, 'admins');" v-if='!bot.administrated' :disabled="loading")
                  v-list-item-icon
                    v-icon mdi-account
                  v-list-item-title {{$t('admin.admins')}}
                v-list-item(@click="openTab(bot, 'greeting');" v-if='!bot.administrated' :disabled="loading")
                  v-list-item-icon
                    v-icon mdi-human-greeting
                  v-list-item-title {{$t('bot.greetings')}}
                v-list-item(@click.stop='updateBot(bot)' v-if='!bot.administrated' :disabled="loading")
                  v-list-item-icon 
                    v-icon refresh
                  v-list-item-title {{$t('bot.update')}}
                v-list-item(@click.stop='deleteBot(bot)' v-if='!bot.administrated' :disabled="loading")
                  v-list-item-icon 
                    v-icon mdi-delete
                  v-list-item-title.red--text {{$t('bot.delete')}}
                v-list-item(@click.stop='rejectBot(bot); settingsNav = false;' v-if='bot.administrated')
                  v-list-item-icon
                    v-icon mdi-delete
                  v-list-item-title.red--text {{$t('bot.reject')}}
              v-list-item(@click='openTab(invite, "invite")' no-action v-for='invite in $store.state.invites' :key='invite.inviteID')
                v-list-item-icon
                  v-icon mdi-alert-decagram
                v-list-item-content
                  v-list-item-title {{invite.bot}}
              v-list-item(@click='addBotDialog = true;' :disabled="loading")
                v-list-item-icon(
                :loading='loading')                
                  v-icon add
                v-list-item-title.blue--text {{$t('addBot.title')}}
          v-col(cols='0' sm='4' md="3" v-else-if='mobile').border__right.border__top
            v-navigation-drawer(v-model="settingsNav" absolute temporary v-if="mobile" :style="listStyle")
              v-list(dense)
                v-list-group(no-action v-for='bot in $store.state.bots' :key='bot._id' v-if="bot.botType !== 'feed'")
                  template(v-slot:activator)
                      v-list-item-icon 
                        v-icon {{getIcon(bot.botType)}}
                      v-list-item-content
                        v-list-item-title  {{bot.name}}
                  v-list-item(@click='openTab(bot, "about"); settingsNav = false;' :disabled="loading")
                    v-list-item-icon
                      v-icon mdi-information
                    v-list-item-title {{$t('bot.about')}}
                  v-list-item(@click='openTab(bot, "admins"); settingsNav = false;' v-if='!bot.administrated' :disabled="loading")
                    v-list-item-icon
                      v-icon mdi-account
                    v-list-item-title {{$t('admin.admins')}}
                  v-list-item(@click='openTab(bot, "greeting"); settingsNav = false;' v-if='!bot.administrated' :disabled="loading")
                    v-list-item-icon
                      v-icon mdi-human-greeting
                    v-list-item-title {{$t('bot.greetings')}}
                  v-list-item(@click.stop='updateBot(bot); settingsNav = false;' v-if='!bot.administrated' :disabled="loading")
                    v-list-item-icon 
                      v-icon refresh
                    v-list-item-title {{$t('bot.update')}}
                  v-list-item(@click.stop='deleteBot(bot); settingsNav = false;' v-if='!bot.administrated' :disabled="loading")
                    v-list-item-icon 
                      v-icon mdi-delete
                    v-list-item-title.red--text {{$t('bot.delete')}}
                  v-list-item(@click.stop='rejectBot(bot); settingsNav = false;' v-if='bot.administrated')
                    v-list-item-icon
                      v-icon mdi-delete
                    v-list-item-title.red--text {{$t('bot.reject')}}
                v-list-item(@click='openTab(invite, "invite"); settingsNav = false;' no-action v-for='invite in $store.state.invites' :key='invite.inviteID')
                  v-list-item-icon
                    v-icon mdi-alert-decagram
                  v-list-item-content
                    v-list-item-title {{invite.bot}}
                v-list-item(@click='addBotDialog = true; settingsNav = false;' :disabled="loading")
                  v-list-item-icon(
                  :loading='loading')                
                    v-icon add
                  v-list-item-title.blue--text {{$t('addBot.title')}}
          v-col(cols='12' sm="8" md="9" v-if='tab && (bot || invite)')
            v-card(outlined tile)           
              v-card-text(v-if="curbot")
                // About tab
                v-card(v-if='tab === "about"').botCard 
                  v-card-title 
                    v-icon {{getIcon(curbot.botType)}} 
                    |{{curbot.name}}
                  v-card-text
                    p FeedrID: {{curbot._id}}
                    p Username: @{{curbot.username}}
                    div(v-if="curbot.botType === 'telegram'")
                      p TelegramID: {{curbot.telegramId}}
                    p {{$t('type')}}: {{curbot.botType}}
                    div(v-if="curbot.botType === 'viber'")
                      p {{$t('avatar')}}: {{curbot.viberAvatar}}
                    p {{$t('bot.status')}}: {{curbot.status}}
                    p {{$t('bot.greetings')}}: {{curbot.greetingMessage}}
                    p {{$t('bot.owner')}}: {{ownershipStatus(curbot)}}
                // Admins invite
                AddAdminTab(:botId="curbot._id" v-else-if='tab === "admins"')
                // Bot edit
                EditBotTab(:botId="curbot._id" :greetingMessage="curbot.greetingMessage" v-else-if='tab === "greeting"')
              // Invite accept tab
              v-card-text(v-else-if="invite")
                v-card(v-if='tab === "invite"').botCard
                  v-card-title {{$t('InviteMessage', { inviter: invite.inviter, bot: invite.bot })}} 
                  v-card-actions
                    v-spacer
                    v-btn(color="red" text @click='RejectInvite(invite.inviteID); openedBot = null; openedTab = null; invite = null;') {{$t('reject')}} 
                    v-btn(color='blue' text @click='AcceptInvite(invite.inviteID); openedBot = null; openedTab = null; invite = null;') {{$t('accept')}} 
          v-col(cols='12' sm='8' md='9' v-else)
            v-card.botCard
              v-card-title(v-if='$store.state.bots.length < 2')
                .headline.pa-4.text-center(style='word-break: break-word;') {{$t('botList.noBotsText')}}
              v-card-title(v-else)
                .headline.pa-4.text-center(style='word-break: break-word;') {{$t('botList.select')}}
                  
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AddBotDialog from './dialogs/AddBotDialog.vue'
import EditBotTab from './dialogs/EditBotTab.vue'
import AddAdminTab from './dialogs/AddAdminTab.vue'
import * as api from '../utils/api'
import { Bot } from '../models/bot'
import * as store from '../plugins/store/store'
import { i18n } from '../plugins/i18n'

@Component({
  props: {
    dialog: Boolean,
    close: Function,
  },
  components: {
    AddBotDialog,
    EditBotTab,
    AddAdminTab,
  },
})
export default class BotsDialog extends Vue {
  loading = false

  addBotDialog = false

  invite: any

  botId = ''
  greetingMessage = ''
  openedTab = ''

  settingsNav = false

  openedBot: Bot | null = null

  mounted() {
    this.updateList()
  }

  get curbot() {
    if (!this.bot) {
      return null
    }
    for (const bot of store.bots()) {
      if (bot._id === this.bot._id) {
        return bot
      }
    }
  }

  setDefault() {
    this.openedTab = ''
    this.openedBot = null
    this.invite = null
  }

  get mobile() {
    return this.$vuetify.breakpoint.xsOnly
  }

  get bot() {
    return this.openedBot
  }

  get tab() {
    return this.openedTab
  }

  openTab(bot: any, tab: string) {
    if (tab !== 'invite') {
      this.openedBot = bot
      this.openedTab = tab
    } else {
      this.openedTab = tab
      this.invite = bot
      this.openedBot = null
    }
  }

  ownershipStatus(bot: Bot) {
    if (bot && !bot.administrated) {
      return i18n.t('yes')
    }
    return i18n.t('no')
  }

  closeAddBotDialog() {
    this.addBotDialog = false
  }

  getIcon(type: string) {
    switch (type) {
      case 'telegram':
        return 'mdi-telegram'
        break
      case 'viber':
        return 'mdi-phone-in-talk'
        break
      default:
        return
    }
  }

  async updateList() {
    if (!store.user()) {
      return
    }
    this.loading = true
    try {
      store.setBots(await api.getBots())
    } catch (err) {
      store.setSnackbarError(err.message)
    } finally {
      this.loading = false
    }
  }

  async updateBot(bot: Bot) {
    this.loading = true
    try {
      await api.updateBot(bot)
      store.setBots(await api.getBots())
    } catch (err) {
      store.setSnackbarError(err.message)
    } finally {
      this.loading = false
    }
  }

  async rejectBot(bot: Bot) {
    if (!confirm(i18n.t('rejectBot.confirm', { name: bot.name }) as string)) {
      return
    }
    this.loading = true
    try {
      await api.RejectBot(bot._id)
      store.setBots(await api.getBots())
    } catch (err) {
      store.setSnackbarError(err.message)
    } finally {
      this.setDefault()
      this.loading = false
    }
  }

  async RejectInvite(inviteID: string) {
    this.loading = true
    try {
      await api.RejectInvite(inviteID)
      store.setBots(await api.getBots())
    } catch (err) {
      store.setSnackbarError(err.message)
    } finally {
      this.loading = false
    }
  }

  async AcceptInvite(inviteID: string) {
    this.loading = true
    try {
      await api.AcceptInvite(inviteID)
      store.setBots(await api.getBots())
    } catch (err) {
      store.setSnackbarError(err.message)
    } finally {
      this.loading = false
    }
  }

  async deleteBot(bot: Bot) {
    if (!confirm(i18n.t('deleteBot.confirm', { name: bot.name }) as string)) {
      return
    }

    this.loading = true
    try {
      await api.deleteBot(bot)
      store.setBots(await api.getBots())
    } catch (err) {
      store.setSnackbarError(err.message)
    } finally {
      this.setDefault()
      this.loading = false
    }
  }
}
</script>


<style>
.botCard {
  margin-bottom: 10px;
}
</style>