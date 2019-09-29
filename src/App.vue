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
        <v-btn text><router-link to="/login">Se connecter</router-link></v-btn>
        <v-btn text><router-link to="/register">S'inscrire</router-link></v-btn>
      </v-toolbar-items>
    </v-toolbar>
      <router-view></router-view>
  </div>
  </v-app>
</template>
