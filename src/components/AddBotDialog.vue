<template lang="pug">
  v-dialog(v-model='dialog'
  scrollable
  max-width='600px'
  persistent)
    v-form(v-model="validtoken" onSubmit="return false;")
      v-card
        v-card-title {{$t('addBot.title')}}
        v-card-text
          v-text-field(:label='$t("addBot.token")' 
          :rules="tokenRules"
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
          :disabled="!validtoken"
          color='blue') {{$t('save')}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as api from "../utils/api";
import * as store from "../plugins/store/store";
import { i18n } from "../plugins/i18n";

@Component({
  props: {
    dialog: Boolean,
    close: Function
  }
})
export default class AddBotDialog extends Vue {
  loading = false;
  token = "";
  validtoken = false;

  async save() {
    this.loading = true;
    try {
      await api.postBot(this.token);
      store.setBots(await api.getBots());
      (this as any).close();
    } catch (err) {
      store.setSnackbarError("errors.bot.add");
    } finally {
      this.loading = false;
    }
  }

  get tokenRules() {
    const regex = new RegExp(/[0-9]+:[a-zA-Z0-9_-]+/);
    return [
      (v: any) => !!v || i18n.t("validation.needtext"),
      (v: any) => regex.test(v) || i18n.t("validation.tokenformat")
    ];
  }
}
</script>
