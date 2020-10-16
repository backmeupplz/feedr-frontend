<template lang="pug">
.v-container.pa-4
  // Main content
  v-layout.text-xs-center(column, justify-center, align-center)
    v-flex(xs12, md10)
      .headline.pb-4
        h4.pa-4 {{ $t("subscription.failedPage") }}
        v-row(justify='center')
          v-btn(color='primary', @click='$router.replace("app")') {{ $t("backToFeedr") }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class SuccessPayment extends Vue {}
</script>
