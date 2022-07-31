<template lang="pug">
v-list-item-title.mb-2.red--text.message-text
  v-tooltip(bottom)
    template(v-slot:activator='{ on }')
      span(v-on='on') {{ $t("message.unsupported") }}
    span(style='white-space:pre-line;') {{ JSON.stringify(message.raw, undefined, 2) }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: ['message'],
})
export default class TelegramUnSupportedMessage extends Vue {}
</script>
