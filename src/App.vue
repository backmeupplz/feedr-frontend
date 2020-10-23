<template lang="pug">
v-app
  cookie-law(
    theme='blood-orange',
    :buttonText='$t("cookie.button")',
    :message='$t("cookie.message")'
  )
  .max-height-s
    Navbar
    Snackbar
    v-content.app-container-max-height
      router-view.app-container-max-height
</template>

<script lang="ts">
import Navbar from './components/Navbar.vue'
import Snackbar from './components/Snackbar.vue'
import * as store from './plugins/store/store'
const CookieLaw = require('vue-cookie-law')

export default {
  components: { Navbar, Snackbar, CookieLaw },
}
</script>

<style>
@media screen and (max-width: 900px) {
  .max-height-s {
    padding: 16px !important;
  }
  .app-container-max-height {
    padding-bottom: 0px !important;
  }
}

* {
  font-family: DM Sans, Source Sans Pro;
  font-style: normal;
  font-weight: 500;
}

html,
body {
  width: 100%;
  height: 100%;
}

.app-container-max-height {
  padding-bottom: 36px;
  height: 100%;
  width: 100%;
}

.max-height-s {
  height: 100%;
  padding: 48px;
  max-height: 100vh;
  max-width: 100%;
}

.max-height {
  height: 100%;
  width: 100%;
}
</style>
