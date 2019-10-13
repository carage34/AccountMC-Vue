<template>
  <v-app>
    <v-container>
      <div class="container">
        <h1 v-if="this.$session.exists()">Bonjour {{pseudo}}</h1>
        <v-card v-if="this.$session.exists()">
          <v-card-title>Liste des comptes</v-card-title>
          <div class="row justify-content-start">
            <div class="col-lg-9">
              <table class="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>
                      <b>Nom</b>
                    </th>
                    <th>
                      <b>Position</b>
                    </th>
                    <th>
                      <b>Action</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in accounts" :key="item.id">
                    <td>
                      <img width="50" height="50" v-bind:src="item.url" />
                    </td>
                    <td>{{item.nom}}</td>
                    <td>{{item.position}}</td>
                    <td>
                      <div class="btn-group">
                        <button type="button" class="btn btn-outline-primary co">
                          <v-progress-circular v-if="show" :size="25" color="primary" indeterminate></v-progress-circular>
                          <span v-if="show"> Loading</span>
                          <span v-if="show==false && item.connected==false">Connecter</span>
                          <span v-if="show==false && item.connected==true">Deconnecter</span>
                        </button>
                        <button
                          type="button"
                          class="btn btn-outline-primary dropdown-toggle dropdown-toggle-split"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <div class="dropdown-menu">
                          <a class="dropdown-item" href="/modify/<%= item.id %>">Modifier</a>
                          <button type="button" class="dropdown-item btn btn-danger">Supprimer</button>
                          <a class="dropdown-item" href="#">Ajouter un groupe</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </v-card>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import VueSession from "vue-session";
import io from 'socket.io-client';
Vue.use(VueSession);
export default {
  data() {
    return {
      pseudo: "",
      accounts: null,
      show: true,
      socket : io('localhost:5555')
    };
  },
  methods: {},
  
  mounted () {
    var self = this;
    this.socket.on('init', function(data) {
      console.log(data)
      self.accounts = data.data
      self.show = false
    })
    
    if (this.$session.exists()) {
      this.pseudo = this.$session.get("pseudo");
    }
  },
  name: "home",
  components: {}
};
</script>
