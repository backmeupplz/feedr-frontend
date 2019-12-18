<template lang="pug">
v-list-item-title(class="mb-3").message-text
  handledText(:message="message")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import handledText from '../Text.vue'

@Component({
  props: ['message'],
  components: {
    handledText,
  },
})
export default class TelegramTextMessage extends Vue {}
</script>
