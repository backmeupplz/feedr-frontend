<template lang="pug">
v-list-item-title.message-text 
    v-container
        v-row(justify="start")
            v-btn(outlined color="indigo" @click="loadPhoto" v-if="!hided") {{$t("media.load")}}
              v-icon(right) mdi-file-image-outline
            div(v-else)
              |{{$t('oldlink')}}
    vue-easy-lightbox(:visible="opened && !expired", :imgs="[message.raw.media]" @hide="hide")
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
  opened = false
  hided = false

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

  async loadPhoto() {
    this.opened = true
    if (this.expired) {
      this.hided = true
    }
  }
}
</script>
