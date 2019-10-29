<style scoped>
a {
  text-decoration: none;
}
.v-application a{
  color: black;
}
</style>

<template>
<v-app>
  <div>
    <v-toolbar>
      <v-toolbar-title>AirVyus</v-toolbar-title>
      <v-toolbar-items>
        <v-btn text><router-link to="/">Accueil</router-link></v-btn>
        <v-btn text><router-link to="/add">Ajouter un compte</router-link></v-btn>
        <v-btn text v-if='this.$session.exists() && this.isAdmin'><router-link to="/users">Liste des utilisateurs</router-link></v-btn>
        <v-btn text v-if="!this.$session.exists()"><router-link to="/login">Se connecter</router-link></v-btn>
        <v-btn text v-if="!this.$session.exists()"><router-link to="/register">S'inscrire</router-link></v-btn>
        <v-btn text v-if="this.$session.exists()" @click="logout">Se deconnecter</v-btn>
      </v-toolbar-items>
    </v-toolbar>
      <router-view></router-view>
  </div>
  </v-app>
</template>

<script>
import Vue from 'vue'
import VueSession from 'vue-session'
import axios from 'axios'
Vue.use(VueSession)
export default {
  data () {
    return {
      pseudo: '',
      isAdmin: false
    }
  },
  methods: {
    init () {
      if (this.$session.has('pseudo')) {
        this.pseudo = this.$session.get('pseudo')
      }
    },
    logout () {
      this.isAdmin = false
      this.$session.destroy()
      this.$router.push('/login')
    }
  },
  mounted () {
    this.init()
    var self = this
    axios.get('http://localhost:5555/isAdmin').then(function (response) {
      if (response.data.isAdmin) {
        self.isAdmin = true
        console.log(self.isAdmin)
      } else {
        self.isAdmin = false
      }
    })
  },
  updated () {
    this.init()
    var self = this
    axios.get('http://localhost:5555/isAdmin').then(function (response) {
      if (response.data.isAdmin) {
        self.isAdmin = true
        console.log(response.data)
      } else {
        self.isAdmin = false
      }
    })
  }
}
</script>
