<template lang="pug">
v-dialog(scrollable, max-width='600px', v-model='dialog', persistent)
  v-card
    v-card-title {{ $t("subscription.subscription") }}
    v-card-text
      v-col
        v-row(v-if='user')
          div(v-if='user.subscriptionStatus === "earlyAdopter"')
            b {{ $t("subscription.subscription") }}:
            | &nbsp;{{ $t("subscription.early") }}
            br
            br
            | {{ $t("subscription.earlyStatusText") }}
          div(v-else-if='user.subscriptionStatus === "active"')
            b {{ $t("subscription.subscription") }}:
            | &nbsp;{{ $t("subscription.active") }}
            br
            br
            | {{ $t("subscription.activeStatusText") }}
            br
            br
            b {{ $t("subscription.nextInvoice") }}:&nbsp;
            | {{ nextInvoice && nextInvoice.amount / 100 }}$ {{ nextInvoice && formatDate(nextInvoice.period.end) }}
          div(v-else-if='user.subscriptionStatus === "inactive"')
            b {{ $t("subscription.subscription") }}:
            | &nbsp;{{ $t("subscription.inactive") }}
            br
            br
            | {{ $t("subscription.inactiveStatusText") }}
          div(v-else-if='user.subscriptionStatus === "failed"')
            b {{ $t("subscription.subscription") }}:
            | &nbsp;{{ $t("subscription.failed") }}
            br
            br
            | {{ $t("subscription.failedStatusText") }}
            br
            br
            b {{ $t("subscription.nextInvoice") }}:&nbsp;
            | {{ nextInvoice && nextInvoice.amount / 100 }}$ {{ nextInvoice && formatDate(nextInvoice.period.end) }}
        v-container
          v-row(justify='center')
            div(v-if='user.subscriptionStatus === "earlyAdopter"')
            div(v-else-if='user.subscriptionStatus === "active"')
              v-col(justify='center')
                v-row(justify='center')
                  v-btn(
                    :loading='loading',
                    outlined,
                    color='indigo',
                    @click.stop='subscripe'
                  ) {{ $t("subscription.update") }}
              v-col(justify='center')
                v-row(justify='center')
                  v-btn(
                    :loading='loading',
                    outlined,
                    color='red',
                    @click.stop='cancelSubscription'
                  ) {{ $t("subscription.cancel") }}
            div(v-else-if='user.subscriptionStatus === "inactive"')
              v-btn(
                :loading='loading',
                outlined,
                color='indigo',
                @click.stop='subscripe'
              ) {{ $t("subscription.price") }}
            div(v-else-if='user.subscriptionStatus === "failed"')
              v-btn(
                :loading='loading',
                outlined,
                color='red',
                @click.stop='subscripe'
              ) {{ $t("subscription.update") }}

    v-card-actions
      v-spacer
      v-btn(color='blue', text, @click='close') {{ $t("close") }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import AddBotDialog from './AddBotDialog.vue'
import * as api from '../utils/api'
import * as store from '../plugins/store/store'
import { i18n } from '../plugins/i18n'
import moment from 'moment'

@Component({
  props: ['dialog', 'close'],
  watch: {
    dialog: function (val) {
      if (val) {
        ;(this as any).updateStatus()
      }
    },
  },
})
export default class Checkout extends Vue {
  loading = false
  nextInvoice: any
  async subscripe() {
    try {
      this.loading = true
      const session = (await api.getStripeSessionId()) as any
      const stripe = (window as any).Stripe(process.env.VUE_APP_STRIPE_PK)
      await stripe.redirectToCheckout({ sessionId: session.id })
    } catch (e) {
      console.log(e)
    }
  }

  formatDate(amount: any) {
    return moment(amount * 1000).format('DD.MM.YYYY')
  }

  async updateStatus() {
    this.loading = true
    const user = store.user()
    if (!user) {
      this.loading = false
      return
    }
    const { status, nextInvoice } = await api.getSubscriptionStatus()
    user.subscriptionStatus = status
    user.nextInvoice = nextInvoice
    this.nextInvoice = nextInvoice
    store.setUser(user)
    this.loading = false
  }

  mounted() {
    this.updateStatus()
  }

  get user() {
    return this.$store.state.user
  }

  async cancelSubscription() {
    try {
      this.loading = true
      await api.cancelSubscription()
      const user = store.user()
      if (!user) {
        return
      }
      const { status, nextInvoice } = await api.getSubscriptionStatus()
      user.subscriptionStatus = status
      user.nextInvoice = nextInvoice
      this.nextInvoice = nextInvoice
      store.setUser(user)
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  }
}
</script>
