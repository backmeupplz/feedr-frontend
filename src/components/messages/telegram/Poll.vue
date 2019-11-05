<template lang="pug">
v-list-item-title(class="mb-3").message-text 
    vue-poll(v-bind="Poll(message.poll)")
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

// @ts-ignore
import VuePoll from "vue-poll";

@Component({
  props: ["message"],
  components: { VuePoll }
})
export default class TelegramPollMessage extends Vue {
  Poll(poll: any) {
    let answers = Array();

    poll.options.map((opt: any, i: any) => {
      answers.push({ value: i + 1, text: opt.text, votes: opt.voter_count });
    });

    return { question: poll.question, answers: answers, showResults: true };
  }
}
</script>