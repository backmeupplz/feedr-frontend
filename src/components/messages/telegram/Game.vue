<template lang="pug">
v-list-item-title(class="mb-3").message-text 
  v-icon
    |mdi-gamepad-variant-outline
  b(v-if="game.title")  {{game.title}}
  br
  br
  i(v-if="game.description") {{game.description}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: ['game'],
})
export default class TelegramGameMessage extends Vue {}
</script>