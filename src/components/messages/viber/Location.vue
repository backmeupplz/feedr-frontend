<template lang="pug">
v-list-item-title.mb-3.message-text
  v-container
    v-row(justify='start')
      v-btn(
        outlined,
        color='indigo',
        @click='openMap(message.location.lat, message.location.lon)'
      ) {{ $t("location") }}
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
}
</script>
