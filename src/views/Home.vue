<template>
<v-app>
  <v-container>
  <div class="home text-xs-center">
    <h1 v-if="this.$session.exists()">Bonjour {{pseudo}}</h1>
    <v-simple-table>

    </v-simple-table>
  </div>
  </v-container>

  </v-app>
</template>

<script>
import Vue from 'vue'
import VueSession from 'vue-session'
Vue.use(VueSession)
export default {
  data() {
    return {
      pseudo: ""
    }
  },
  methods: {
  },
  mounted(){
    if(this.$session.exists()) {
      this.pseudo = this.$session.get("pseudo")
    }
  },
  name: 'home',
  components: {

  }
}
</script>
