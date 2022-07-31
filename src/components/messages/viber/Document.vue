<template lang="pug">
v-list-item-title.message-text 
  v-container(fluid)
    v-row(dense, :justify='mobile()', v-if='!hided')
      v-col.col_nogrow(md='auto')
        v-btn(fab, outlined, small, color='indigo', @click='loadSticker') 
          v-icon mdi-download
      v-col(md='auto')
        .caption(v-if='message.raw.file_name') {{ message.raw.file_name }}
        .caption {{ filesize(message.raw.size) }}
    div(v-else) 
      | {{ $t("oldlink") }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '../../../utils/api'
import * as store from '../../../plugins/store/store'

@Component({
  props: ['message'],
})
export default class TelegramDocumentMessage extends Vue {
  hided = false

  get expired() {
    const url = new URL(this.$props.message.raw.media)
    const expires = url.searchParams.get('Expires')
    if (Number(expires) * 1000 < Number(new Date())) {
      return true
    }
    return false
  }
  async loadSticker() {
    if (this.expired) {
      this.hided = true
    } else {
      window.open(this.$props.message.raw.media, '_blank')
    }
  }

  filesize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    if (i === 0) return `${bytes} ${sizes[i]}`
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
  }

  mobile() {
    if (this.$vuetify.breakpoint.xsOnly) {
      return 'center'
    }
    return 'start'
  }
}
</script>

<style lang="scss">
.row_nowrap {
  flex-wrap: nowrap !important;
}

.col_nogrow {
  flex-grow: 0 !important;
}

.text_anywherewrap {
  word-wrap: anywhere;
}
</style>
