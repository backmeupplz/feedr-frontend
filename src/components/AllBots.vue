<template lang="pug">
.d-flex.flex-column.allbots-container
  div(v-for='bot in bots', :key='bot._id', @click='setActiveBot(bot)')
    .d-flex.align-center.allbots-bot-container
      .allbots-avatar-circle
      span.app-view-bot-container-text {{ (bot.botType === "feed" && $t("feed")) || bot.name }}
    .app-view-bot-divier
</template>

<script lang="ts">
import { Bot } from '@/models/bot'
import * as store from '../plugins/store/store'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class AllBots extends Vue {
  @Prop({ required: true }) setActiveBot!: (bot: Bot) => void

  get bots() {
    return store.bots()
  }
}
</script>

<style>
.allbots-container {
  background: #0f0f22;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  max-width: 160px;
  width: 100%;
  height: 100%;
  margin-right: 8px;
}

.allbots-bot-container {
  cursor: pointer;
  font-size: 16px;
  line-height: 21px;
  color: #ffffff;
  padding: 16px;
  height: 60px;
}

.allbots-avatar-circle {
  margin-right: 8px;
  height: 24px;
  width: 24px;
  min-width: 24px;
  min-height: 24px;
  background: linear-gradient(90deg, #03c1fd 0%, #4b0cff 100%);
  border-radius: 50%;
  display: inline-block;
}
</style>
