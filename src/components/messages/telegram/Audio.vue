<template lang="pug">
v-list-item-title.message-text 
    div(v-if="message.raw.caption") {{message.raw.caption}}
    br(v-if='message.raw.caption')
    div(v-if="message.raw.audio && message.raw.audio.title") {{title}}
    v-container(fluid)
        v-row(v-if="!loaded" :justify="mobile").row_nowrap
          v-col
            v-btn(outlined color="indigo" :loading="loading" @click="loadAudio") {{$t('media.play')}}
              v-icon(right) mdi-music
        v-row(dense)
          v-col(md="auto").col_nogrow
            v-btn(outlined color="indigo" v-if="loaded" @click="changeAudio" icon)
              v-icon(v-if="paused") mdi-play
              v-icon(v-else) mdi-pause
          v-col(md="8")
            v-slider(v-model="currtime" v-if="loaded" :min="0" inverse-label @change="setPosition" :label="label" :max="totalDuration")
          audio(ref="audioController")
              source(:src="link" v-if="loaded"  :type="types()")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '../../../utils/api'
import * as store from '../../../plugins/store/store'

@Component({
  props: ['message'],
})
export default class TelegramAudioMessage extends Vue {
  $refs!: Vue['$refs'] & {
    audioController: any
  }
  link = ''
  loading = false
  loaded = false
  paused = true
  totalDuration = 0
  currtime = 0

  get title() {
    const msg = this.$props.message.raw.audio
    if (msg.performer) {
      return `${msg.performer} — ${msg.title}`
    }
    return `${msg.title}`
  }

  async loadAudio() {
    this.loading = true
    try {
      let fetched = await api.getFilesLink(this.$props.message)
      switch (fetched.status) {
        case 'ok':
          this.link = fetched.url
          this.loaded = true
          break
        case 'tobig':
          store.setSnackbar({
            message: 'errors.media.tobig',
            color: 'error',
            active: true,
          })
          break
          defult: store.setSnackbar({
            message: 'errors.media.loading',
            color: 'error',
            active: true,
          })
      }
    } catch {
      store.setSnackbar({
        message: 'errors.media.loading',
        color: 'error',
        active: true,
      })
    } finally {
      this.loading = false
    }
  }

  get label() {
    if (this.$vuetify.breakpoint.width < 340) {
      return false
    }
    let minutes = Math.floor(this.totalDuration / 60) as any
    let seconds = Math.floor(this.totalDuration % 60) as any

    if (seconds < 10) {
      seconds = '0' + String(seconds)
    }

    if (minutes < 10) {
      minutes = '0' + String(minutes)
    }

    let curmin = Math.floor(this.currtime / 60) as any
    let cursecs = Math.floor(this.currtime % 60) as any

    if (cursecs < 10) {
      cursecs = '0' + String(cursecs)
    }

    if (curmin < 10) {
      curmin = '0' + String(curmin)
    }

    return `${curmin}:${cursecs}/${minutes}:${seconds}`
  }

  _handlePlayPause(e: any) {
    if (e.type === 'pause') {
      this.paused = true
    }
  }

  _handleLoaded(e: any) {
    this.totalDuration = Number(this.$refs.audioController.duration)
  }

  _handlePlayingUI(e: any) {
    this.currtime = this.$refs.audioController.currentTime
  }

  mounted() {
    this.$refs.audioController.addEventListener('pause', this._handlePlayPause)
    this.$refs.audioController.addEventListener(
      'playing',
      this._handlePlayPause,
    )
    this.$refs.audioController.addEventListener(
      'timeupdate',
      this._handlePlayingUI,
    )
    this.$refs.audioController.addEventListener(
      'loadeddata',
      this._handleLoaded,
    )
  }

  changeAudio() {
    const player = this.$refs.audioController
    if (player.paused) {
      this.paused = false
      player.play()
    } else {
      player.pause()
    }
  }

  types() {
    const audio = this.$props.message.raw.audio || this.$props.message.raw.voice
    return audio.mime_type
  }

  setPosition(time: any) {
    this.$refs.audioController.currentTime = time
  }

  get mobile() {
    if (this.$vuetify.breakpoint.xsOnly) {
      return 'center'
    }
    return 'start'
  }
}
</script>

<style lang="scss">
.player {
  height: calc(100vh - 70px);
  width: 100%;
}
</style>