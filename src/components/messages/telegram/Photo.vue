<template lang="pug">
v-list-item-title.message-text 
  handledText(:message='message')
  v-container
    v-row(justify='start')
      v-btn(outlined, color='white  ', :loading='loading', @click='loadPhoto') {{ $t("media.load") }}
        v-icon(right) mdi-file-image-outline
  vue-easy-lightbox(:visible='opened', :imgs='[link]', @hide='hide')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as api from '../../../utils/api'
import * as store from '../../../plugins/store/store'
import handledText from '../Text.vue'

@Component({
  props: ['message'],
  components: {
    handledText,
  },
})
export default class TelegramPhotoMessage extends Vue {
  link = ''
  loading = false
  opened = false

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
