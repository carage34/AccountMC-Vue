import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    admin: false
  },
  mutations: {
    change(state, admin) {
      state.admin = admin
    }
  },
  getters: {
    admin: state => state.admin
  }
})