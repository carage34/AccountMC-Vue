<style scoped>
.v-application a {
  color: #212529
}

.carte {
  background: rgba(255, 255, 255, 0.90) !important;
}

</style>

<template>
  <v-app>
    <v-container>
      <dialog-info ref='dialoginfo' :msg='true'></dialog-info>
      <modal-confirm ref='modalconfirm' v-on:del-acc='delAcc'></modal-confirm>
      <div class='container'  >
        <v-card  v-if='this.$session.exists()' class="carte">
          <h1 class="black--text" style="padding-left:15px; padding-top:15px;" v-if='this.$session.exists()'>Bonjour {{pseudo}}</h1>
          <v-card-title>Liste des comptes</v-card-title>
          <div style="padding:15px">
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
                      <div class='btn-group'>
                        <button
                          type='button'
                          @click='action(item.id)'
                          :disabled='item.load'
                          class='btn btn-outline-primary co'>
                          <v-progress-circular
                          v-if="item.load"
                          :size="25"
                          color="primary"
                          indeterminate
                        ></v-progress-circular>
                          <span v-if='item.load'>Loading</span>
                          <span v-if='item.load == false && item.connected==false'>Connecter</span>
                          <span v-if='item.load == false && item.connected==true'>Deconnecter</span>
                        </button>
                        <button
                        v-if="isAdmin"
                          type='button'
                          class='btn btn-outline-primary dropdown-toggle dropdown-toggle-split'
                          data-toggle='dropdown'
                          aria-haspopup='true'
                          aria-expanded='false'
                        >
                          <span class='sr-only'>Toggle Dropdown</span>
                        </button>
                        <div class='dropdown-menu'
                        v-if="isAdmin">
                          <a class='dropdown-item' href='#' @click="$router.push('/modify/'+item.id)">
                            <v-icon>mdi-pencil</v-icon>Modifier
                          </a>
                          <button
                            type='button'
                            @click='deleteAccount(item.id, item.nom)'
                            class='dropdown-item btn btn-danger'
                          >
                            <v-icon>mdi-delete</v-icon>Supprimer
                          </button>
                          <a class='dropdown-item' href='#'>
                            <v-icon>mdi-plus-box</v-icon>Ajouter un groupe
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </v-card>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import Vue from 'vue'
import VueSession from 'vue-session'
import io from 'socket.io-client'
import Dialog from '../components/Dialogue'
import ModalConfirm from '../components/ModalConfim'
import axios from 'axios'
Vue.use(VueSession)
export default {
  data () {
    return {
      pseudo: '',
      accounts: {},
      show: true,
      socket: io('http://airvyus.com'),
      isAdmin: false
    }
  },
  methods: {
    connect (id) {
      this.show = false
      this.$socket.emit('action', { id: id })
    },
    action (id) {
      this.accounts[id].load = true
      this.socket.emit('action', { my: id })
    },
    deleteAccount (id, nom) {
      this.$refs.modalconfirm.setMessage(
        'Voulez vous vraiment supprimer le compte ' + nom
      )
      this.$refs.modalconfirm.setHeading('Confirmation')
      this.$refs.modalconfirm.setConfirmUrl(
        '/deleteaccount/' + id, id
      )
      this.$refs.modalconfirm.toggle()
    },
    delAcc (id) {
      this.socket.emit('delAcc', { my: id })
    }
  },
  sockets: {
    init: function (data) {
      console.log(data)
    }
  },
  mounted () {
    if (!this.$session.exists()) {
      this.$router.push('/login')
    }
    var self = this
    axios.get('/isAdmin').then(function (response) {
      if (response.data.isAdmin) {
        self.isAdmin = true
        console.log(response.data)
      }
    })
    this.socket.on('init', function (data) {
      self.accounts = data.data
      self.show = false
    })

    this.socket.on('enable_co', function (data) {
      console.log('enable_co')
      console.log(data)
      self.accounts[data.id].connected = true
      self.accounts[data.id].load = false
    })

    this.socket.on('enable_deco', function (data) {
      self.accounts[data.id].connected = false
      self.accounts[data.id].load = false
    })

    this.socket.on('disable', function (data) {
      self.accounts[data.id].load = true
    })

    this.socket.on('logged', function (data) {
      self.accounts[data.id].load = false
      self.accounts[data.id].connected = true
      self.$refs.dialoginfo.setMessage(
        data.username + ' s\'est connecté au serveur avec succès'
      )
      self.$refs.dialoginfo.setHeading('Connexion')
      self.$refs.dialoginfo.toggle()
    })
    this.socket.on('update', function (data) {
      self.accounts = data.data
    })

    if (this.$session.exists()) {
      this.pseudo = this.$session.get('pseudo')
    }
  },
  updated () {},
  name: 'home',
  components: {
    'dialog-info': Dialog,
    'modal-confirm': ModalConfirm
  }
}
</script>
