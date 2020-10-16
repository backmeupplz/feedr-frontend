<template lang="pug">
v-dialog(scrollable, max-width='600px', v-model='dialog', persistent)
  v-card
    v-card-title {{ $t("merge.header") }}
    v-card-text
      v-col
        v-row(v-if='user')
          span 
            | {{ $t("merge.text1") }}&nbsp;
            span(v-if='$store.state.language === "ru"')
              a(href='https://t.me/feedrbot', target='_blank') @feedrbot
              | &nbsp;{{ $t("merge.text2") }}
        v-container
          v-col.justify-center.d-flex(v-if='!$store.state.user.telegramId')
            vue-telegram-login(
              mode='callback',
              telegram-login='feedrbot',
              @callback='onTelegramAuth',
              radius='3',
              :userpic='false'
            )
          v-col.justify-center.d-flex(v-if='!$store.state.user.facebookId')
            fb-signin-button(
              :params='{ scope: "email", return_scopes: true }',
              @success='onFacebookSignInSuccess',
              @error='onFacebookSignInError'
            ) {{ $t("home.facebook") }}
          v-col.justify-center.d-flex(v-if='!$store.state.user.email')
            g-signin-button(
              :params='{ client_id: googleClientId }',
              @success='onGoogleSignInSuccess',
              @error='onGoogleSignInError'
            ) {{ $t("home.google") }}

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
const { vueTelegramLogin } = require('vue-telegram-login')

// FB object is global, declaring here for TS
declare const FB: any

@Component({
  components: {
    vueTelegramLogin,
  },
  props: ['dialog', 'close'],
})
export default class Merge extends Vue {
  loading = false

  async onTelegramAuth(loginInfo: any) {
    try {
      const user = await api.mergeTelegram(loginInfo)
      if (user) {
        store.setUser(user)
      }
    } catch ({ response }) {
      store.setSnackbar({
        message: response.data || 'Error with api',
        color: 'error',
        active: true,
      })
    }
  }

  async onGoogleSignInSuccess(googleUser: any) {
    try {
      const user = await api.mergeGoogle(googleUser.getAuthResponse().id_token)
      if (user) {
        store.setUser(user)
      }
    } catch ({ response }) {
      store.setSnackbar({
        message: response.data || 'Error with api',
        color: 'error',
        active: true,
      })
    }
  }
  onGoogleSignInError(e: any) {
    store.setSnackbar({
      message: 'errors.login.google',
      color: 'error',
      active: true,
    })
  }

  onFacebookSignInSuccess(response: any) {
    FB.api('/me', async (dude: any) => {
      try {
        const user = await api.mergeFacebook(response.authResponse.accessToken)
        if (user) {
          store.setUser(user)
        }
      } catch ({ response }) {
        store.setSnackbar({
          message: response.data || 'Error with api',
          color: 'error',
          active: true,
        })
      }
    })
  }

  onFacebookSignInError(e: any) {
    store.setSnackbar({
      message: 'errors.login.facebook',
      color: 'error',
      active: true,
    })
  }

  get user() {
    return this.$store.state.user
  }

  get googleClientId() {
    return '302048926858-k211pbhb02t32gc1osqbh2q3sv3u5h9g.apps.googleusercontent.com'
  }
}
</script>
