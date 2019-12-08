<template lang="pug">
  div
    v-progress-linear(indeterminate v-if="BotsLoading")
    NoBots(v-if='!$store.state.bots.length && !BotsLoading')
    div(v-else)
      v-tabs(v-model='tab' show-arrows)
        v-tab(v-for='bot in $store.state.bots' :key='bot._id') {{bot.name}}&nbsp;
          v-icon(x-small v-if="bot.botType === 'viber'") mdi-phone-in-talk
          v-icon(x-small v-else) mdi-telegram
          |&nbsp;
          .count-badge.count-badge--botTab(v-if="bot.unread") {{bot.unread}}
      v-tabs-items(v-model='tab')
        v-tab-item(v-for='(bot, i) in $store.state.bots' :key='bot._id' :value='i')
          BotView(:bot='bot')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import NoBots from '../components/NoBots.vue'
import BotView from '../components/BotView.vue'
import * as store from '../plugins/store/store'

@Component({
  components: { NoBots, BotView },
})
export default class Superpower extends Vue {
  get tab() {
    return store.botTab()
  }

  set tab(value) {
    store.setBotTab(value)
  }

  get BotsLoading() {
    return store.botsloading()
  }
}
</script>

<style>
/* .count-badge */
.theme--dark .count-badge {
  align-items: center;
  border-radius: 11px;
  color: #ffffff !important;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 13px !important;
  font-weight: 900;
  height: 22px;
  justify-content: center;
  line-height: normal;
  min-width: 22px;
  padding: 0 4px;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

  background-color: #856fb8;
}

.count-badge {
  align-items: center;
  border-radius: 11px;
  color: #ffffff !important;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 13px !important;
  font-weight: 900;
  height: 22px;
  justify-content: center;
  line-height: normal;
  min-width: 22px;
  padding: 0 4px;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

  background-color: #40a7e3;
}

.count-badge--botTab {
  position: relative !important;
  top: -9px;
}
</style>