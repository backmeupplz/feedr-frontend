<template lang="pug">
  div
    AddBotDialog(:dialog='addBotDialog'
    :close='closeAddBotDialog')
    EditBotDialog(:dialog='editBotDialog'
    :close='closeEditBotDialog' v-bind:greetingMessage="greetingMessage" 
    v-bind:botId="botId")
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
          p(v-if='!$store.state.bots.length && !loading') {{$t('botList.noBotsText')}}
          v-card(v-for='bot in $store.state.bots' :key='bot._id').botCard
            v-card-title {{bot.name}}
            v-card-text
              p Username: @{{bot.username}}
              p Telegram id: {{bot.telegramId}}
              p Feedr id: {{bot._id}}
              p Status: {{bot.status}}
              p Greetings message: {{bot.greetingMessage}}
            v-card-actions
              v-spacer
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
import Vue from "vue";
import Component from "vue-class-component";
import AddBotDialog from "./AddBotDialog.vue";
import EditBotDialog from "./EditBotDialog.vue";
import * as api from "../utils/api";
import { Bot } from "../models/bot";
import * as store from "../plugins/store/store";
import { i18n } from "../plugins/i18n";

@Component({
  props: {
    dialog: Boolean,
    close: Function
  },
  components: {
    AddBotDialog,
    EditBotDialog
  }
})
export default class BotsDialog extends Vue {
  loading = false;

  addBotDialog = false;
  editBotDialog = false;

  botId = "";
  greetingMessage = "";

  mounted() {
    this.updateList();
  }

  closeAddBotDialog() {
    this.addBotDialog = false;
  }

  closeEditBotDialog() {
    this.editBotDialog = false;
  }

  dialogEditBot(botId: string, greetingMessage: string) {
    this.botId = botId;
    this.greetingMessage = greetingMessage;
    this.editBotDialog = true;
  }

  async updateList() {
    if (!store.user()) {
      return;
    }
    this.loading = true;
    try {
      store.setBots(await api.getBots());
    } catch (err) {
      store.setSnackbarError(err.message);
    } finally {
      this.loading = false;
    }
  }

  async updateBot(bot: Bot) {
    this.loading = true;
    try {
      await api.updateBot(bot);
      store.setBots(await api.getBots());
    } catch (err) {
      store.setSnackbarError(err.message);
    } finally {
      this.loading = false;
    }
  }

  async deleteBot(bot: Bot) {
    if (!confirm(i18n.t("deleteBot.confirm", { name: bot.name }) as string)) {
      return;
    }

    this.loading = true;
    try {
      await api.deleteBot(bot);
      store.setBots(await api.getBots());
    } catch (err) {
      store.setSnackbarError(err.message);
    } finally {
      this.loading = false;
    }
  }
}
</script>


<style>
.botCard {
  margin-bottom: 10px;
}
</style>