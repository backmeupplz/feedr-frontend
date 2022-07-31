// Dependencies
import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import * as store from './store/store'

const vuesockets = new VueSocketIO({
  debug: true,
  connection: process.env.VUE_APP_SOCKETS,
  vuex: {
    store: store.store,
    actionPrefix: 'socket_action',
    mutationPrefix: 'socket_',
  },
})

Vue.use(vuesockets)

// Global hack here
declare const global: any
global.sockets = vuesockets.io
