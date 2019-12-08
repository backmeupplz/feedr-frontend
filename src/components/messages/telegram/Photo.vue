<template lang="pug">
v-list-item-title.message-text 
    div(v-if="message.raw.caption" v-html="messageText") 
    v-container
        v-row(justify="start")
            v-btn(outlined color="indigo" :loading="loading" @click="loadPhoto") {{$t("media.load")}}
              v-icon(right) mdi-file-image-outline
    vue-easy-lightbox(:visible="opened", :imgs="[link]" @hide="hide")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '../../../utils/api'
import * as store from '../../../plugins/store/store'
@Component({
  props: ['message'],
})
export default class TelegramPhotoMessage extends Vue {
  link = ''
  loading = false
  opened = false

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

  hide() {
    this.opened = false
  }

  async loadPhoto() {
    this.loading = true
    try {
      this.link = await api.getFilesLink(this.$props.message)
      this.opened = true
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
