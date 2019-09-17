<template lang="pug">
  div
    AddBotDialog(:dialog='addBotDialog'
    :close='closeAddBotDialog')
    v-dialog(v-model='dialog'
    scrollable
    max-width='600px'
    persistent)
      v-card
        v-card-title {{$t('botList.title')}}
        v-card-text
          p(v-if='!bots.length && !loading') {{$t('botList.noBotsText')}}
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

@Component({
  props: {
    dialog: Boolean,
    close: Function
  },
  components: {
    AddBotDialog
  }
})
export default class BotsDialog extends Vue {
  bots = [];
  loading = false;

  addBotDialog = false;

  closeAddBotDialog() {
    this.addBotDialog = false;
  }
}
</script>
