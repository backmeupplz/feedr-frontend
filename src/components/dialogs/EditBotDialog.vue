<template lang="pug">
  v-dialog(v-model='dialog'
  scrollable
  max-width='600px'
  persistent)
    v-form(v-model="validgreeting" onSubmit="return false;")
      v-card
        v-card-title {{$t('editBot.title')}}
        v-card-text
            .body-1 Текущее сообщение: {{greetingMessage}}
            v-textarea(:label='$t("editBot.greeting")' 
            :rules="greetingRules"
            multiline
            v-model='newGreetings')
        v-card-actions
          v-spacer
          v-btn(text 
          @click='close'
          :loading='loading'
          color='error') {{$t('cancel')}}
          v-btn(text
          @click='save'
          :loading='loading'
          :disabled="!validgreeting"
          color='blue') {{$t('save')}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as api from "../../utils/api";
import * as store from "../../plugins/store/store";
import { i18n } from "../../plugins/i18n";

@Component({
  props: {
    dialog: Boolean,
    close: Function,
    greetingMessage: String,
    botId: String
  },
  watch: {
    dialog: function(val) {
      if ((this as any).greetingMessage) {
        (this as any).newGreetings = (this as any).greetingMessage;
      }
    }
  }
})
export default class EditBotDialog extends Vue {
  loading = false;
  newGreetings = "";
  validgreeting = false;

  async save() {
    this.loading = true;
    try {
      await api.BotChangeGreetings(this.$props.botId, this.newGreetings);
      store.setBots(await api.getBots());
      (this as any).close();
    } catch (err) {
      if (err && err.response && err.response.data) {
        store.setSnackbarError(err.response.data);
      } else {
        store.setSnackbarError("errors.bot.edit");
      }
    } finally {
      this.loading = false;
    }
  }

  get greetingRules() {
    return [
      (v: any) => !!v || i18n.t("validation.needtext"),
      (v: any) =>
        (v && v.length < 2000) || i18n.t("validation.greetings.toomanychars")
    ];
  }
}
</script>
