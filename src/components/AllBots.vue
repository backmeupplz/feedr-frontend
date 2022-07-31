<template lang="pug">
.d-flex.flex-column.allbots-container
  v-slide-group(
    multiple='',
    show-arrows='',
    v-if='this.$vuetify.breakpoint.smAndDown'
  )
    v-slide-item(v-for='bot in bots', :key='bot._id')
      .d-flex.allbots-slide-bot.align-center(
        ,
        @click='setActiveBot(bot)',
        :class='activeBot ? (bot.name === activeBot.name ? "allbots-slide-bot-active" : "") : ""'
      )
        .allbots-avatar-circle
        .allbots-slider-text {{ bot.name }}
        .app-view-bot-message-title-unread(v-if='bot.unread > 0') {{ bot.unread > 99 ? "99+" : bot.unread }}
  div(v-for='bot in bots', :key='bot._id', @click='setActiveBot(bot)', v-else)
    .d-flex.align-center.allbots-bot-container(
      :class='activeBot.name === bot.name ? "allbots-bot-container-active" : ""'
    )
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

@Component({
  components: {},
})
export default class AllBots extends Vue {
  @Prop({ required: true }) setActiveBot!: (bot: Bot) => void
  @Prop({ required: true }) activeBot!: Bot

  get bots() {
    return store.bots()
  }
}
</script>

<style>
@media screen and (max-width: 900px) {
  .allbots-container {
    max-width: 100% !important;
    min-height: 0% !important;
    margin-bottom: 20px;
  }
}

@media screen and (min-width: 900px) {
  .allbots-container {
    background: #0f0f22;
  }
  .allbots-bot-container-active {
    background: #18182b;
  }
}

.allbots-container {
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  max-width: 160px;
  width: 100%;
  min-height: 100%;
  margin-right: 8px;
  max-height: 100%;
  overflow-y: auto;
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

.allbots-slide-bot {
  padding: 12px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  margin-right: 8px;
  cursor: pointer;
}

.allbots-slide-bot-active {
  background: #0f0f22 !important;
}

.allbots-slider-text {
  margin-right: 12px;
}
</style>
