<template lang="pug">
v-list-item-title(class="mb-3").message-text {{text}}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["text"]
})
export default class TelegramTextMessage extends Vue {}
</script>