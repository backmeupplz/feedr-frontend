<template lang="pug">
span
    span(v-for='(text, i) in messageText' :key='i')
        a(v-if="text.type === 'link'" :href="text.url", target="_blank") {{text.value}}
        a(v-else-if="text.type === 'handle'" :href="getHandle(text.value.slice(1))", target="_blank") {{text.value}}
        span(v-else-if="text.type === 'text' && text.value") {{text.value}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { l } from './../../utils/linkify'

@Component({
  props: ['message'],
})
export default class TelegramTextMessage extends Vue {
  get messageText() {
    let raw = this.$props.message.raw
    if (!raw.text && !raw.caption) {
      return
    }
    if (raw.text) {
      return l(raw.text)
    }
    if (raw.caption) {
      return l(raw.caption)
    }
  }

  getHandle(handle: string) {
    switch (this.$props.message.type) {
      case 'telegram':
        return `https://t.me/${handle}`
        break
      case 'viber':
        return `https://viber.me/${handle}`
        break
      default:
        return `https://t.me/${handle}`
    }
  }
}
</script>
