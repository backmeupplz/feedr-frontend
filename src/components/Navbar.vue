<template lang="pug">
  nav
    BotsDialog(:dialog='botsDialog' :close='closeBotsDialog')
    Checkout(:dialog='subscriptionDialog' :close='closeSubscription')
    Merge(:dialog='mergeDialog' :close='closeMerge')
    v-app-bar(flat app)
      // Title
      router-link(:to='$store.state.user ? "/app" : "/"')
        v-toolbar-title.text-uppercase.grey--text
          v-tooltip(v-if='$store.state.user' bottom)
            template(v-slot:activator='{ on }')
              span(v-on='on') {{$t('title')}}
            span {{$store.state.user.name}}, {{$store.state.user.email || $store.state.user.facebookId || $store.state.user.telegramId}}
          span(v-else) {{$t('title')}}
      v-spacer
      v-chip(color='error' v-if='$store.state.user && $store.state.user.subscriptionStatus !== "active" && $store.state.user.subscriptionStatus !== "earlyAdopter"') {{$t('subscription.noSub')}}
      // Language picker
      v-menu(offset-y)
        template(v-slot:activator='{ on }')
          v-btn(text icon color='grey' v-on='on') {{currentLocale.icon}}
        v-list
          v-list-item(v-for='locale in locales' @click='changeLanguage(locale.code)' :key="locale.code")
            v-list-item-title {{locale.icon}}
      v-menu(offset-y)
        template(v-slot:activator='{ on }')
          v-btn(text icon color='grey' v-on='on') 
            v-icon mdi-dots-vertical
        v-list
          // Bots
          v-list-item(@click.stop='botsDialog = true' v-if="$store.state.user")
            v-list-item-title {{$t('navbar.bots')}}
          // Merge
          v-list-item(@click.stop='mergeDialog = true' v-if="$store.state.user")
            v-list-item-title {{$t('merge.header')}}
          // Subscription
          v-list-item(@click.stop='subscriptionDialog = true' v-if="$store.state.user")
            v-list-item-title {{$t('subscription.subscription')}}
          // Dark mode
          v-list-item(@click='toggleMode')
            v-list-item-title {{currentTheme}}
          // Logout
          v-list-item(@click='logout')
            v-list-item-title {{$t('navbar.logout')}}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import * as store from '../plugins/store/store'
import { i18n } from '../plugins/i18n'
import * as api from '../utils/api'
import BotsDialog from './BotsDialog.vue'
import Checkout from './Checkout.vue'
import Merge from './Merge.vue'

@Component({
  components: {
    BotsDialog,
    Checkout,
    Merge,
  },
})
export default class Navbar extends Vue {
  botsDialog = false
  subscriptionDialog = false
  mergeDialog = false

  get locales() {
    return [
      { icon: '🇺🇸', code: 'en' },
      { icon: '🇷🇺', code: 'ru' },
    ]
  }
  get currentLocale() {
    for (const locale of this.locales) {
      if (locale.code === i18n.locale) {
        return locale
      }
    }
  }

  get currentTheme() {
    if (store.dark()) {
      return `${i18n.t('themes.dark')}: ${i18n.t('themes.on')}`
    }
    return `${i18n.t('themes.dark')}: ${i18n.t('themes.off')}`
  }

  mounted() {
    ;(this.$vuetify.theme as any).dark = store.dark()
  }

  closeBotsDialog() {
    this.botsDialog = false
  }
  closeSubscription() {
    this.subscriptionDialog = false
  }
  closeMerge() {
    this.mergeDialog = false
  }
  toggleMode() {
    store.setDark(!store.dark())
    ;(this.$vuetify.theme as any).dark = store.dark()
  }
  changeLanguage(locale: string) {
    i18n.locale = locale
    store.setLanguage(locale)
    document.title = i18n.t('title') as string
  }
  logout() {
    store.logout()
    this.$router.replace('/')
  }
}
</script>

<style>
nav a:link {
  text-decoration: none;
}

nav a:visited {
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

nav a:active {
  text-decoration: underline;
}
</style>

