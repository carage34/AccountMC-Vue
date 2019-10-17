<template>
  <v-app>
    <v-container>
      <div class='container'>
        <h1 v-if='this.$session.exists()'>Bonjour {{pseudo}}</h1>
        <v-card v-if='this.$session.exists()'>
          <v-card-title>Liste des comptes</v-card-title>
          <div class='row justify-content-start'>
            <div class='col-lg-9'>
              <table class='table'>
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
                  <tr v-for='item in accounts' :key='item.id'>
                    <td>
                      <img width='50' height='50' v-bind:src='item.url' />
                    </td>
                    <td>{{item.nom}}</td>
                    <td>{{item.position}}</td>
                    <td>
                      <div class="btn-group">
                        <button type="button" @click="action(item.id)" :disabled='item.load' class="btn btn-outline-primary co">
                          <v-progress-circular v-if="item.load" :size="25" color="primary" indeterminate></v-progress-circular>
                          <span v-if="item.load"> Loading</span>
                          <span v-if="item.load == false && item.connected==false">Connecter</span>
                          <span v-if="item.load == false && item.connected==true">Deconnecter</span>
                        </button>
                        <button
                          type='button'
                          class='btn btn-outline-primary dropdown-toggle dropdown-toggle-split'
                          data-toggle='dropdown'
                          aria-haspopup='true'
                          aria-expanded='false'>
                          <span class='sr-only'>Toggle Dropdown</span>
                        </button>
                        <div class='dropdown-menu'>
                          <a class='dropdown-item' href='/modify/<%= item.id %>'>Modifier</a>
                          <button type='button' class='dropdown-item btn btn-danger'>Supprimer</button>
                          <a class='dropdown-item' href='#'>Ajouter un groupe</a>
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
import axios from 'axios'
import Vue from 'vue'
import VueSession from 'vue-session'
import io from 'socket.io-client'
Vue.use(VueSession)
export default {
  data () {
    return {
      pseudo: "",
      accounts: {},
      show: true,
      socket: io('localhost:5555')
    }
  },
  methods: {
    connect (id) {
      this.show = false
      this.$socket.emit('action', { id: id })
    }
  },
  sockets: {
    init: function(data) {
      console.log(data)
      //this.accounts = data.data
    }
  },
  methods: {
    action(id) {
      this.accounts[id].load = true
      this.socket.emit('action', {my: id})
    }
  },
  mounted () {
    var self = this;
    this.socket.on('init', function(data) {
      self.accounts = data.data
      self.show = false
    })

    this.socket.on('enable_co', function (data) {
      console.log("enable_co")
      console.log(data)
      self.accounts[data.id].connected = true
      self.accounts[data.id].load = false
    })

    this.socket.on('enable_deco', function (data) {
      self.accounts[data.id].connected = false
      self.accounts[data.id].load = false
    })

    this.socket.on('disable', function (data) {
      this.accounts[data.id].load = true
    })

    if (this.$session.exists()) {
      this.pseudo = this.$session.get('pseudo')
    }
  },
  updated () {
  },
  name: "home",
  components: {}
}
</script>
