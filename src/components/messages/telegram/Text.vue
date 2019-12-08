<template lang="pug">
v-list-item-title(class="mb-3" v-html="messageText").message-text
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: ['message'],
})
export default class TelegramTextMessage extends Vue {
  get messageText() {
    const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)*/gm
    let string = this.$props.message.raw.text
    string = this.strip(string)

    let stringWithUrls = string.replace(regex, (match: any) => {
      return `<a href="${match}" target="_blank">${match}</a>`
    })

    const handleRegex = /\B@[a-z0-9_-]+/gm
    let stringWithUrlsAndHandles
    if (this.$props.message.type === 'telegram') {
      stringWithUrlsAndHandles = stringWithUrls.replace(
        handleRegex,
        (match: any) => {
          return `<a href="https://t.me/${match.slice(
            1,
          )}" target="_blank">${match}</a>`
        },
      )
    }

    if (this.$props.message.type === 'viber') {
      stringWithUrlsAndHandles = stringWithUrls.replace(
        handleRegex,
        (match: any) => {
          return `<a href="https://viber.me/${match.slice(
            1,
          )}" target="_blank">${match}</a>`
        },
      )
    }
    return stringWithUrlsAndHandles
  }

  strip(html: string) {
    let doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || 'No text data'
  }
}
</script>