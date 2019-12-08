<template lang="pug">
v-list-item-title.message-text 
    v-container(fluid)
        v-row(justify="start")
            v-btn(outlined color="indigo" :loading="loading" @click="loadSticker" v-if="!opened") {{$t("media.load")}}
                v-icon(right) mdi-sticker-emoji
        v-row
            v-img(:src="link" v-if="opened" contain width="256px" height="256px")
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
  link = ''
  loading = false
  opened = false

  async loadSticker() {
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