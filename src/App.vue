<style scoped>
a {
  text-decoration: none;
}
.v-application a{
  color: black;
}

.deco {
  transition: all 0.2s;
}

.deco:hover {
  background: #ff7e67;
  transition: all 0.2s;
}

@font-face {
font-family: "Minecraft";
src: url('assets/Minecraft.woff'),
}

* {
  font-family: 'Roboto Mono', monospace;
}

.titre1 {
  padding-left: 30px;
}

</style>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap');

.v-application--wrap {
  background: url('https://wallpaperaccess.com/full/171177.jpg') center;
}

.toolbar {
    background-color: lightgrey;
}

.view {
  background-color: lightgrey;
}

.v-btn__content {
text-transform: none !important;
}


</style>

<template>
<v-app>
  <div>
    <v-toolbar class="toolbar" right >
      <router-link style="text-decoration:none;" to="/"><v-toolbar-title class="titre1">AirVyus</v-toolbar-title></router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <router-link to="/"><v-btn style="height:100%;" text>Accueil</v-btn></router-link>
        <router-link to="/add"><v-btn style="height:100%;" class="text--bold" text>Ajouter un compte</v-btn></router-link>
        <router-link to="/users"><v-btn style="height:100%;" text v-if='this.$session.exists() && this.isAdmin'>Liste des utilisateurs</v-btn></router-link>
        <router-link to="/login"><v-btn style="height:100%;" text v-if="!this.$session.exists()">Se connecter</v-btn></router-link>
        <router-link to="/register"><v-btn style="height:100%;" text v-if="!this.$session.exists()">S'inscrire</v-btn></router-link>
        <v-btn class="deco" text v-if="this.$session.exists()" @click="logout">Se deconnecter</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <router-view class="view"></router-view>
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
