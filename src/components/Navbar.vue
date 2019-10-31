<template lang="pug">
  nav
    BotsDialog(:dialog='botsDialog' :close='closeBotsDialog')
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
      // Bots
      v-btn(v-if="$store.state.user"
      text
      icon
      color='grey'
      @click='botsDialog = true')
        v-icon(small) adb
      // Dark mode
      v-btn(text icon color='grey' @click='toggleMode')
        v-icon(small) brightness_2
      // Language picker
      v-menu(offset-y)
        template(v-slot:activator='{ on }')
          v-btn(text icon color='grey' v-on='on') {{currentLocale.icon}}
        v-list
          v-list-item(v-for='locale in locales' @click='changeLanguage(locale.code)' :key="locale.code")
            v-list-item-title {{locale.icon}}
      // Logout
      v-btn(v-if="$store.state.user"
      text
      icon
      color='grey'
      @click='logout')
        v-icon(small) exit_to_app
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import * as store from "../plugins/store/store";
import { i18n } from "../plugins/i18n";
import * as api from "../utils/api";
import BotsDialog from "./BotsDialog.vue";

@Component({
  components: {
    BotsDialog
  }
})
export default class Navbar extends Vue {
  botsDialog = false;

  get locales() {
    return [{ icon: "🇺🇸", code: "en" }, { icon: "🇷🇺", code: "ru" }];
  }
  get currentLocale() {
    for (const locale of this.locales) {
      if (locale.code === i18n.locale) {
        return locale;
      }
    }
  }

  closeBotsDialog() {
    this.botsDialog = false;
  }
  toggleMode() {
    store.setDark(!store.dark());
    (this.$vuetify.theme as any).dark = store.dark();
  }
  changeLanguage(locale: string) {
    i18n.locale = locale;
    store.setLanguage(locale);
    document.title = i18n.t("title") as string;
  }
  logout() {
    store.logout();
    this.$router.replace("/");
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
