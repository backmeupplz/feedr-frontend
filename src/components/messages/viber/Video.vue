<template lang="pug">
v-list-item-title.message-text 
  v-container
    v-row(justify='start')
      v-btn(
        outlined,
        color='indigo',
        :loading='loading',
        @click='loadVideo',
        v-if='!hided'
      ) {{ $t("media.load") }}
        v-icon(right) mdi-video-outline
      div(v-else) 
        | {{ $t("oldlink") }}
    v-dialog(v-model='opened', fullscreen, hide-overlay)
      v-card
        v-toolbar(dark)
          v-btn(icon, dark, @click='opened = false')
            v-icon mdi-close
          v-toolbar-title Viber Video
        video.player(controls, ref='videoplayer')
          source(:src='message.raw.media', type='video/mp4')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '../../../utils/api'
import * as store from '../../../plugins/store/store'

@Component({
  props: ['message'],
})
export default class TelegramVideoMessage extends Vue {
  opened = false
  hided = false

  updated() {
    let player: any
    player = this.$refs.videoplayer
    player.pause()
  }

  get expired() {
    const url = new URL(this.$props.message.raw.media)
    const expires = url.searchParams.get('Expires')
    if (Number(expires) * 1000 < Number(new Date())) {
      return true
    }
    return false
  }

  hide() {
    this.opened = false
  }

  async loadVideo() {
    if (this.expired) {
      this.hided = true
    } else {
      this.opened = true
    }
  }
}
</script>

<style lang="scss">
.player {
  height: calc(100vh - 70px);
  width: 100%;
}
</style>
