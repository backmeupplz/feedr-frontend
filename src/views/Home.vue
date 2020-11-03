<template lang="pug">
div
  // Main content
  .d-flex.flex-column.justify-center.align-center.text-center
    v-flex(xs12, md10)
      .headline.pb-4 {{ $t("home.info") }}
      .title.pb-4 {{ $t("home.info2") }}
      .title.pb-4 {{ $t("home.info3") }}
    .d-flex.flex-column.pt-4
      vue-telegram-login(
        mode='callback',
        telegram-login='feedrbot',
        @callback='onTelegramAuth',
        radius='3',
        :userpic='false'
      )
      // Google
      v-btn.signin-button.google-signin(@click='loginWithGoogle')
        span {{ $t("home.google") }}
      // Facebook
      v-btn.signin-button.facebook-signin(@click='loginWithFacebook')
        span {{ $t("home.facebook") }}
      div(v-if='debug')
        v-text-field(
          label='Debug token login',
          v-model='debugToken',
          append-icon='send',
          @click:append='debugTokenLogin'
        )
    v-row
      v-col.d-flex.justify-center
        v-img(src='/images/feedr.png', max-width='400')
      v-col.d-flex.justify-center
        v-img(src='/images/telegram.png', max-width='400')
    v-flex.pt-4(xs12, md10)
      .title.pb-4(v-html='$t("home.contact")')
    v-flex.text-left(row, justify-center)
      v-col(
        v-for='(review, i) in $t("feedback.reviews")',
        :key='i',
        cols='12',
        sm='6'
      )
        v-card
          v-list-item.px-4.pt-3
            v-list-item-avatar
              img(:src='`/avatars/${review.username}.jpg`')
            v-list-item-content
              a(:href='`https://t.me/${review.username}`') @{{ review.username }}
          v-card-text
            p(v-for='(text, i) in review.text.split("\\n")') {{ text }}
    v-flex.py-4
      .caption
        router-link(to='/privacy') {{ $t("home.privacy") }}
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import {
  loginFacebook,
  loginTelegram,
  loginGoogle,
  loginToken,
} from '../utils/api'
import * as store from '../plugins/store/store'
import * as api from '../utils/api'
import Component from 'vue-class-component'
import { i18n } from '../plugins/i18n'
const { vueTelegramLogin } = require('vue-telegram-login')
import * as firebase from 'firebase/app'
import 'firebase/auth'

// It's the same global hack
declare let sockets: any

@Component({
  components: {
    vueTelegramLogin,
  },
})
export default class Home extends Vue {
  debugToken = ''

  get debug() {
    return !!process.env.VUE_APP_DEV
  }

  async debugTokenLogin() {
    try {
      console.log(this.debugToken)
      const user = await loginToken(this.debugToken)
      store.setUser(user)
      sockets.send('authorization', user.token)
    } catch (error) {
      store.setSnackbarError(error)
    }
  }

  async mounted() {
    try {
      const result = await firebase.auth().getRedirectResult()
      if (result.credential) {
        const token = (result.credential as any).accessToken
        const user = await loginGoogle(token)
        store.setUser(user)
        sockets.send('authorization', user.token)
        try {
          store.setBots(await api.getBots())
        } catch (err) {
          store.setSnackbarError(err.message)
        } finally {
          this.$router.replace('app')
        }
      }
    } catch (error) {
      store.setSnackbarError(error.message)
    }
  }

  async loginWithGoogle() {
    const authProvider = new firebase.auth.GoogleAuthProvider()
    authProvider.addScope('email')
    authProvider.addScope('profile')
    await firebase.auth().signInWithRedirect(authProvider)
  }

  async loginWithFacebook() {
    const authProvider = new firebase.auth.FacebookAuthProvider()
    authProvider.addScope('email')
    try {
      const result = await firebase.auth().signInWithPopup(authProvider)
      const token = (result.credential as any).accessToken
      const user = await loginFacebook(token)
      try {
        store.setBots(await api.getBots())
      } catch (err) {
        store.setSnackbarError(err.message)
      } finally {
        this.$router.replace('app')
      }
    } catch (error) {
      store.setSnackbarError(error.message)
    }
  }

  async onTelegramAuth(loginInfo: any) {
    try {
      const user = await loginTelegram(loginInfo)
      store.setUser(user)
      sockets.send('authorization', user.token)
      try {
        store.setBots(await api.getBots())
      } catch (err) {
        store.setSnackbarError(err.message)
      } finally {
        this.$router.replace('app')
      }
    } catch (err) {
      store.setSnackbar({
        message: 'errors.login.telegram',
        color: 'error',
        active: true,
      })
    }
  }
}
</script>

<style>
.google-signin {
  background-color: #ce5658 !important;
}

.facebook-signin {
  background-color: #647daf !important;
}

.signin-button {
  text-align: center !important;
  align-items: center !important;
  margin: 10px;
  cursor: pointer;
  display: block;
  padding: 16px !important;
  border-radius: 3px;
  color: #fff !important;
}
</style>
