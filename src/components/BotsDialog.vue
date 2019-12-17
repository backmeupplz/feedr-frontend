<template lang="pug">
  div
    AddBotDialog(:dialog='addBotDialog'
    :close='closeAddBotDialog')
    EditBotDialog(:dialog='editBotDialog'
    :close='closeEditBotDialog' v-bind:greetingMessage="greetingMessage" 
    v-bind:botId="botId")
    AddAdminDialog(:dialog='addAdminDialog'
    :close='closeAddAdminDialog' v-bind:botId="botId")
    v-dialog(v-model='dialog'
    scrollable
    max-width='600px'
    persistent)
      v-card
        v-card-title
          span {{$t('botList.title')}}
          v-spacer
          v-btn(icon
          :loading='loading'
          @click='updateList')
            v-icon refresh
        v-card-text
          p(v-if='$store.state.bots.length && $store.state.bots.length < 2 && !loading') {{$t('botList.noBotsText')}}
          v-card(v-for='bot in $store.state.bots' :key='bot._id' v-if="bot.botType !== 'feed'").botCard
            v-card-title {{bot.name}}
            v-card-text
              p FeedrID: {{bot._id}}
              p Username: @{{bot.username}}
              div(v-if="bot.botType === 'telegram'")
                p TelegramID: {{bot.telegramId}}
              p {{$t('type')}}: {{bot.botType}}
              div(v-if="bot.botType === 'viber'")
                p {{$t('avatar')}}: {{bot.viberAvatar}}
              p {{$t('bot.status')}}: {{bot.status}}
              p {{$t('bot.greetings')}}: {{bot.greetingMessage}}
              p {{$t('bot.owner')}}: {{ownershipStatus(bot)}}
            v-card-actions(v-if="bot && !bot.administrated")
              v-spacer
              v-btn(icon
              :loading='loading'
              @click='dialogAddAdmin(bot._id)')
                v-icon mdi-account
              v-btn(icon
              :loading='loading'
              @click='dialogEditBot(bot._id, bot.greetingMessage)')
                v-icon edit
              v-btn(icon
              :loading='loading'
              @click='updateBot(bot)')
                v-icon refresh
              v-btn(icon
              :loading='loading'
              @click='deleteBot(bot)')
                v-icon delete
            v-card-actions(v-else-if="bot && bot.administrated")
              v-spacer
              v-btn(icon :loading='loading' @click='rejectBot(bot)')
                v-icon delete
          v-card(v-for='invite in $store.state.invites' :key='invite.inviteID').botCard
            v-card-title {{$t('InviteMessage', { inviter: invite.inviter, bot: invite.bot })}} 
            v-card-actions
              v-spacer
              v-btn(color="red" text @click='RejectInvite(invite.inviteID)') {{$t('reject')}} 
              v-btn(color='blue' text @click='AcceptInvite(invite.inviteID)') {{$t('accept')}} 
        v-card-actions
          v-btn(text
          icon
          color='primary'
          :loading='loading'
          @click='addBotDialog = true')
            v-icon add
          v-spacer
          v-btn(color='blue'
          text 
          @click='close'
          :loading='loading') {{$t('close')}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AddBotDialog from './dialogs/AddBotDialog.vue'
import EditBotDialog from './dialogs/EditBotDialog.vue'
import AddAdminDialog from './dialogs/AddAdminDialog.vue'
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
    EditBotDialog,
    AddAdminDialog,
  },
})
export default class BotsDialog extends Vue {
  loading = false

  addBotDialog = false
  addAdminDialog = false
  editBotDialog = false

  botId = ''
  greetingMessage = ''

  mounted() {
    this.updateList()
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

  closeEditBotDialog() {
    this.editBotDialog = false
  }

  closeAddAdminDialog() {
    this.addAdminDialog = false
  }

  dialogAddAdmin(botId: string) {
    this.botId = botId
    this.addAdminDialog = true
  }

  dialogEditBot(botId: string, greetingMessage: string) {
    this.botId = botId
    this.greetingMessage = greetingMessage
    this.editBotDialog = true
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