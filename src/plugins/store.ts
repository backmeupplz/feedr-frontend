// Dependencies
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export interface State {}

const storeOptions = {
  state: {},
  mutations: {},
  getters: {},
  plugins: [createPersistedState()],
}

export const store = new Vuex.Store<State>(storeOptions)
