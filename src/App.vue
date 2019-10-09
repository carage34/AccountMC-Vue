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
        <v-btn text>Ajouter un compte</v-btn>
        <v-btn text>Liste des utilisateurs</v-btn>
        <v-btn text v-if="!this.$session.exists()"><router-link to="/login">Se connecter</router-link></v-btn>
        <v-btn text v-if="!this.$session.exists()"><router-link to="/register">S'inscrire</router-link></v-btn>
         <v-btn text v-if="this.$session.exists()" @click="logout"><router-link to="/logout">Se deconnecter</router-link></v-btn>
      </v-toolbar-items>
    </v-toolbar>
      <router-view></router-view>
  </div>
  </v-app>
</template>

<script>
import Vue from 'vue'
import VueSession from 'vue-session'
Vue.use(VueSession)
export default {
  data () {
    return {
      pseudo: ''
    }
  },
  methods: {
    init () {
      if (this.$session.has('pseudo')) {
        this.pseudo = this.$session.get('pseudo')
      }
    },
    logout () {
      this.$session.destroy()
      this.$router.push('/')
    }
  },

  mounted () {
    this.init()
  }
}
</script>
