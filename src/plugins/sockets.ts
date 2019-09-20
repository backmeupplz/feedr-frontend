// Dependencies
import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import * as store from './store'

const vuesockets = new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3000',
  vuex: {
    store: store.store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
})

Vue.use(vuesockets)

// Global hack here
declare const global: any
global.sockets = vuesockets.io
