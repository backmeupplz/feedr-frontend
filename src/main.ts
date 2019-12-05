// Dependencies
import Vue from 'vue'
import App from './App.vue'
import router from './plugins/router'
import './plugins/sockets'
import { store } from './plugins/store/store'
import { i18n } from './plugins/i18n'
import './plugins/facebook'
import './plugins/google'
import vuetify from './plugins/vuetify'
import VueObserveVisibility from 'vue-observe-visibility'
import Lightbox from 'vue-easy-lightbox'

Vue.use(Lightbox)
Vue.use(VueObserveVisibility)
Vue.config.productionTip = true

const vm = new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App),
}).$mount('#app')

export default vm
