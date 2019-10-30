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

.routerlink:hover {
    background: green;
  transition: all 0.2s;
}

.routerlink {
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

.btn-outline-primary:not(:disabled):not(.disabled):active:focus, .show>.btn-outline-primary.dropdown-toggle:focus {
  -webkit-box-shadow: none!important;
  box-shadow: none!important;

}

.btn-outline-primary:not(:disabled):not(.disabled).active, .btn-outline-primary:not(:disabled):not(.disabled):active, .show>.btn-outline-primary.dropdown-toggle {
  color: #fff!important;
    background-color: green !important;
    border-color: green !important;
}

.btn-outline-primary {
  color: green !important;
    border-color: green !important;
}

.btn-outline-primary:hover {
    color: #fff!important;
    background-color: green !important;
    border-color: green !important;
}

.v-application--wrap {
  background: url('http://wallpaperswide.com/download/minecraft_landscape-wallpaper-1920x1080.jpg') fixed center;
  background-size : cover;
}

.toolbar {
    background-color: lightgrey;
}

.view {
  background-color: lightgrey;
  margin-top : 50px;
}

</style>

<template>
<v-app>
  <div>
    <v-toolbar class="toolbar" right >
      <router-link style="text-decoration:none;" to="/"><v-toolbar-title class="titre1">AirVyus</v-toolbar-title></router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <router-link class="routerlink" to="/"><v-btn style="height:100%; text-transform: none ; font-size:1em;" text>Accueil</v-btn></router-link>
        <router-link class="routerlink" to="/add"><v-btn style="height:100%; text-transform: none ; font-size:1em;" class="text--bold" text>Ajouter un compte</v-btn></router-link>
        <router-link class="routerlink" to="/users"><v-btn style="height:100%; text-transform: none ; font-size:1em;" text v-if='this.$session.exists() && this.isAdmin'>Liste des utilisateurs</v-btn></router-link>
        <router-link class="routerlink" to="/login"><v-btn style="height:100%; text-transform: none ; font-size:1em;" text v-if="!this.$session.exists()">Se connecter</v-btn></router-link>
        <router-link class="routerlink" to="/register"><v-btn style="height:100%; text-transform: none ; font-size:1em;" text v-if="!this.$session.exists()">S'inscrire</v-btn></router-link>
        <v-btn style="height:100%; text-transform: none ; font-size:1em;" class="deco" text v-if="this.$session.exists()" @click="logout">Se deconnecter</v-btn>
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
    axios.get('/isAdmin').then(function (response) {
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
    axios.get('/isAdmin').then(function (response) {
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
