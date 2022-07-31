<template lang="pug">
v-list-item-title.mb-3.message-text
  div(v-if='message.venue') {{ $t("place") }}: {{ message.venue.title }}
  v-container
    v-row(justify='start')
      v-btn(
        outlined,
        color='indigo',
        @click='openMap(message.location.latitude, message.location.longitude)'
      ) {{ buttonText(message) }}
        v-icon(right) mdi-crosshairs-gps
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { i18n } from '../../../plugins/i18n'

@Component({
  props: ['message'],
})
export default class TelegramLocationMessage extends Vue {
  openMap(latitude: number, longitude: number) {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      '_blank'
    )
  }

  buttonText(message: any) {
    let text = message.venue ? i18n.t('place') : i18n.t('location')
    return text
  }
}
</script>
