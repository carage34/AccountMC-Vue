import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import './plugins/fontawesome'
import 'vuetify/dist/vuetify.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import vuetify from './plugins/vuetify'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import socketio from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import { store } from './store/store'
import VueAxios from 'vue-axios'
import axios from 'axios'
axios.defaults.withCredentials = true
Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
library.add(faUserSecret)
Vue.use(Vuetify)
Vue.use(new VueSocketIO({
  debug: true,
  connection: socketio('https://airvyus.com') // options object is Optional
})
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
