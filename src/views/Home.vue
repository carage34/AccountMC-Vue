<template>
<v-app>
  <v-container>
  <div class="home text-xs-center">
    <h1 v-if="this.$session.exists()">Bonjour {{pseudo}}</h1>
    <v-simple-table dense=true>
      <template v-slot:default>
        <thead>
          <tr>
            <th></th>
            <th><b>Nom</b></th>
            <th><b>Position</b></th>
            <th><b>Action</b></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in accounts" :key="item.id">
            <td><img width="50" height="50" v-bind:src="item.url"/></td>
            <td>{{item.nom}}</td>
            <td>{{item.position}}</td>
            <td></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
  </v-container>

  </v-app>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import VueSession from 'vue-session'
Vue.use(VueSession)
export default {
  data() {
    return {
      pseudo: "",
      accounts: null
    }
  },
  methods: {
  },
  mounted(){
    if(this.$session.exists()) {
      this.pseudo = this.$session.get("pseudo")
    }
    var self = this
    axios.get('http://localhost:5555/accounts')
    .then(function (response){
      console.log(response)
      self.accounts = response.data
    })
  },
  name: 'home',
  components: {

  }
}
</script>
