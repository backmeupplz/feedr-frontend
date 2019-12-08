<template lang="pug">
v-list-item-title.message-text 
    div(v-if="message.raw.caption" v-html="messageText")
    v-container
        v-row(justify="start")
            v-btn(outlined color="indigo" :loading="loading" @click="loadVideo") {{$t("media.load")}}
              v-icon(right) mdi-video-outline
        v-dialog(v-model="opened" fullscreen hide-overlay)
          v-card
            v-toolbar(dark color="primary")
              v-btn(icon dark @click="opened = false")
                v-icon mdi-close
              v-toolbar-title(v-if="message.raw.video") Telegram Video
              v-toolbar-title(v-else-if="message.raw.video_note") Telegram Telescope Video
              v-toolbar-title(v-else) Telegram Animation
            video(controls ref="videoplayer").player
              source(:src="link" type="video/mp4")
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
  link = ''
  loading = false
  opened = false

  updated() {
    let player: any
    player = this.$refs.videoplayer
    player.pause()
  }

  get messageText() {
    const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)*/gm
    let string = this.$props.message.raw.caption
    string = this.strip(string)

    let stringWithUrls = string.replace(regex, (match: any) => {
      return `<a href="${match}" target="_blank">${match}</a>`
    })

    const handleRegex = /\B@[a-z0-9_-]+/gm
    let stringWithUrlsAndHandles
    if (this.$props.message.type === 'telegram') {
      stringWithUrlsAndHandles = stringWithUrls.replace(
        handleRegex,
        (match: any) => {
          return `<a href="https://t.me/${match.slice(
            1,
          )}" target="_blank">${match}</a>`
        },
      )
    }

    if (this.$props.message.type === 'viber') {
      stringWithUrlsAndHandles = stringWithUrls.replace(
        handleRegex,
        (match: any) => {
          return `<a href="https://viber.me/${match.slice(
            1,
          )}" target="_blank">${match}</a>`
        },
      )
    }
    return stringWithUrlsAndHandles
  }

  strip(html: string) {
    let doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || 'No text data'
  }

  async loadVideo() {
    this.loading = true
    try {
      let fetched = await api.getFilesLink(this.$props.message)
      switch (fetched.status) {
        case 'ok':
          this.link = fetched.url
          this.opened = true
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
}
</script>

<style lang="scss">
.player {
  height: calc(100vh - 70px);
  width: 100%;
}
</style>