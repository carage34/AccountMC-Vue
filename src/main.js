import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './plugins/fontawesome'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import socketio from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
Vue.use(BootstrapVue)
library.add(faUserSecret)

Vue.use(new VueSocketIO({
  debug: true,
  connection: socketio('http://localhost:5555') // options object is Optional
})
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
