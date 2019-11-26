<template lang="pug">
v-list-item-title.message-text 
    div(v-if="message.raw.caption") {{message.raw.caption}}
    v-container(fluid)
        v-row(justify="start")
            v-btn(outlined color="indigo" :loading="loading" @click="loadSticker" v-if="!opened") {{$t("media.load")}}
                v-icon(right) mdi-sticker-emoji
        v-row
            v-img(:src="message.raw.media" v-if="opened" contain width="256px" height="256px")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '../../../utils/api'
import * as store from '../../../plugins/store/store'

@Component({
  props: ['message'],
})
export default class TelegramStickerMessage extends Vue {
  opened = false

  async loadSticker() {
    this.opened = true
  }
}
</script>