<template lang="pug">
  v-dialog(v-model='dialog'
  scrollable
  max-width='600px'
  persistent)
    v-card
      v-card-title {{$t('addBot.title')}}
      v-card-text
        v-text-field(:label='$t("addBot.token")'
        single-line
        v-model='token')
      v-card-actions
        v-spacer
        v-btn(text 
        @click='close'
        :loading='loading'
        color='error') {{$t('cancel')}}
        v-btn(text
        @click='save'
        :loading='loading'
        color='blue') {{$t('save')}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as api from "../utils/api";
import * as store from "../plugins/store";

@Component({
  props: {
    dialog: Boolean,
    close: Function
  }
})
export default class AddBotDialog extends Vue {
  loading = false;
  token = "";

  async save() {
    this.loading = true;
    try {
      await api.postBot(this.token);
      (this as any).close();
    } catch (err) {
      store.setSnackbarError("errors.bot.add");
    } finally {
      this.loading = false;
    }
  }
}
</script>
