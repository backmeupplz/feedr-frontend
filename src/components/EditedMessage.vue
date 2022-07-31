<template lang="pug">
v-row.pa-4(justify='center') 
  MessageComponent(:edited='true', :message='mes')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import MessageComponent from './Message.vue'

@Component({
  components: { MessageComponent: () => import('./Message.vue') },
  props: ['message', 'type', 'editIndex', '_id', 'name'],
})
export default class EditedMessage extends Vue {
  get mes() {
    if (this.$props.message && this.$props.type) {
      let r = Object.assign({}, this.$props.message)
      // If this edited message
      if (!r.raw) {
        r.raw = Object.assign({}, r)
        r._id = this.$props._id
        r.type = this.$props.type

        if (this.$props.type === 'vk') {
          r.raw.name = this.$props.name
        }
      }
      // Set index for backend
      if (this.$props.editIndex) {
        r.editIndex = this.$props.editIndex
      }
      // Return formatted message
      return r
    }
  }
}
</script>
