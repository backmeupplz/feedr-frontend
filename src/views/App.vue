<template lang="pug">
  div
    NoBots(v-if='!$store.state.bots.length')
    div(v-else)
      v-tabs(v-model='tab')
        v-tab(v-for='bot in $store.state.bots' :key='bot._id') {{bot.name}}
      v-tabs-items(v-model='tab')
        v-tab-item(v-for='(bot, i) in $store.state.bots' :key='bot._id' :value='i')
          BotView(:bot='bot')
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import NoBots from "../components/NoBots.vue";
import BotView from "../components/BotView.vue";
import * as store from "../plugins/store/store";

@Component({
  components: { NoBots, BotView }
})
export default class Superpower extends Vue {
  tab = 0;
}
</script>