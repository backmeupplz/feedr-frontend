<template lang="pug">
  .v-container.pa-4(:style="homeStyle")
    // Main content
    v-layout(column
    justify-center
    align-center).text-center
      v-flex(xs12 md10)
        .headline.pb-4 {{$t("home.info")}}
        .title.pb-4 {{$t("home.info2")}}
        .title.pb-4 {{$t("home.info3")}}
      v-flex.pt-4
        vue-telegram-login(mode='callback'
        telegram-login='feedrbot'
        @callback='onTelegramAuth'
        radius='3'
        :userpic='false')
        g-signin-button(:params='{ client_id: googleClientId }'
        @success='onGoogleSignInSuccess'
        @error='onGoogleSignInError') {{$t("home.google")}}
        fb-signin-button(:params='{ scope: "email", return_scopes: true}'
        @success='onFacebookSignInSuccess'
        @error='onFacebookSignInError') {{$t('home.facebook')}}
      v-row
        v-col.d-flex.justify-center
          v-img(src='/images/feedr.png' max-width='400')
        v-col.d-flex.justify-center
          v-img(src='/images/telegram.png' max-width='400')
      v-flex.pt-4(xs12 md10)
        .title.pb-4(v-html='$t("home.contact")')
      v-flex(row justify-center).text-left
        v-col(v-for='(review, i) in $t("feedback.reviews")'
        :key='i'
        cols='12'
        sm='6')
          v-card
            v-list-item.px-4.pt-3
              v-list-item-avatar
                img(:src='`/avatars/${review.username}.jpg`')
              v-list-item-content
                a(:href='`https://t.me/${review.username}`') @{{review.username}}
            v-card-text
              p(v-for='(text, i) in review.text.split("\\n")') {{text}}
      v-flex.py-4
        .caption
          router-link(to='/privacy') {{ $t('home.privacy') }}
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { loginFacebook, loginTelegram, loginGoogle } from '../utils/api'
import * as store from '../plugins/store/store'
import * as api from '../utils/api'
import Component from 'vue-class-component'
import { i18n } from '../plugins/i18n'
const { vueTelegramLogin } = require('vue-telegram-login')

// FB object is global, declaring here for TS
declare const FB: any
// It's the same global hack
declare let sockets: any

@Component({
  components: {
    vueTelegramLogin,
  },
})
export default class Home extends Vue {
  winheight = 0

  get homeStyle() {
    let height = this.winheight - 64
    let heghtPx = height + 'px'
    return { height: heghtPx, overflowY: 'auto' }
  }

  WindowHeight(data: any) {
    this.winheight = data.target.innerHeight
  }

  mounted() {
    this.winheight = window.innerHeight
    this.$nextTick(function() {
      window.addEventListener('resize', this.WindowHeight)
    })
  }

  get googleClientId() {
    return '302048926858-k211pbhb02t32gc1osqbh2q3sv3u5h9g.apps.googleusercontent.com'
  }

  onFacebookSignInSuccess(response: any) {
    FB.api('/me', async (dude: any) => {
      try {
        const user = await loginFacebook(response.authResponse.accessToken)
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
          message: 'errors.login.facebook',
          color: 'error',
          active: true,
        })
      }
    })
  }
  onFacebookSignInError(error: Error) {
    store.setSnackbar({
      message: 'errors.login.facebook',
      color: 'error',
      active: true,
    })
  }
  async onGoogleSignInSuccess(googleUser: any) {
    try {
      const user = await loginGoogle(googleUser.getAuthResponse().id_token)
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
        message: 'errors.login.google',
        color: 'error',
        active: true,
      })
    }
  }
  onGoogleSignInError(error: Error) {
    store.setSnackbar({
      message: 'errors.login.google',
      color: 'error',
      active: true,
    })
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
.fb-signin-button {
  cursor: pointer;
  display: block;
  padding: 10px 46px;
  border-radius: 3px;
  background-color: #647daf;
  color: #fff;
  margin: 10px;
}
.g-signin-button {
  margin: 10px;
  cursor: pointer;
  display: block;
  padding: 10px 46px;
  border-radius: 3px;
  background-color: #ce5658;
  color: #fff;
}
</style>
