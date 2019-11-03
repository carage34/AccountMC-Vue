<style>
.carte {
  background: rgba(255, 255, 255, 0.90) !important;
}
</style>

<style scoped>
.pad {
  margin: 5px;
}
</style>

<template>
  <v-app>
    <v-container>
      <div class="container">
        <dialog-info ref='dialoginfo' :msg='true'></dialog-info>
        <v-card class="carte">
          <v-card-title>Liste des utilisateurs</v-card-title>
          <div class="row justify-content-start">
            <div class="col-lg-9">
              <table class="table">
                <thead>
                  <tr>
                    <th>
                      <b>Nom</b>
                    </th>
                    <th>
                      <b>Status</b>
                    </th>
                    <th>
                      <b>Action</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in users" :key="item.id">
                    <td>{{item.pseudo}}</td>
                    <td>{{item.admin === 1 ? 'Admin' : 'Membre'}}</td>
                    <td>
                      <a href="#">
                        <button
                          type="button"
                          class="btn btn-outline-primary pad"
                          @click="updateStatus(item.admin, item.id)"
                          :disabled='item.load'
                        ><span v-if="!item.load">{{item.admin === 0 ? 'Promouvoir admin' : 'Révoquer admin'}}</span>
                          <v-progress-circular
                          v-if="item.load"
                          :size="25"
                          color="primary"
                          indeterminate
                        ></v-progress-circular>
                        <span v-if="item.load">Loading</span>
                        </button>
                      </a>
                      <a href="#">
                        <button type="button" class="btn btn-outline-danger pad" @click="deleteUser(item.id)">Supprimer</button>
                      </a>
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
import Dialog from '../components/Dialogue'
export default {
  data () {
    return {
      users: null
    }
  },
  methods: {
    updateUser () {
      var self = this
      axios.get(process.env.VUE_APP_API_URL + '/users').then(function (response) {
        self.users = response.data
      })
    },
    updateStatus (status, id) {
      var self = this
      self.users[id].load = true
      if (status === 1) {
        axios
          .get(process.env.VUE_APP_API_URL + '/revoke/' + id)
          .then(function (response) {
            if (response.data.status === 'success') {
              self.users[id].admin = 0
              self.users[id].load = false
              self.$refs.dialoginfo.setMessage(
                'Status admin retiré avec succès'
              )
              self.$refs.dialoginfo.setHeading('Succès')
              self.$refs.dialoginfo.toggle()
            } else {
              self.users[id].load = false
              self.$refs.dialoginfo.setMessage(
                'Erreur lors du retrait'
              )
              self.$refs.dialoginfo.setHeading('Erreur')
              self.$refs.dialoginfo.toggle()
            }
          })
      } else {
        axios
          .get(process.env.VUE_APP_API_URL + '/promote/' + id)
          .then(function (response) {
            if (response.data.status === 'success') {
              self.users[id].admin = 1
              self.users[id].load = false
              self.$refs.dialoginfo.setMessage(
                'Status admin ajouté avec succès'
              )
              self.$refs.dialoginfo.setHeading('Succès')
              self.$refs.dialoginfo.toggle()
            } else {
              self.users[id].load = false
              self.$refs.dialoginfo.setMessage(
                'Erreur lors de l\'ajout'
              )
              self.$refs.dialoginfo.setHeading('Erreur')
              self.$refs.dialoginfo.toggle()
            }
          })
      }
    },
    deleteUser (id) {
      var self = this
      axios
        .get(process.env.VUE_APP_API_URL + '/deleteUser/' + id)
        .then(function (response) {
          if (response.data.status === 'success') {
            self.$refs.dialoginfo.setMessage(
              'Compte supprimé avec succès'
            )
            self.$refs.dialoginfo.setHeading('Succès')
            self.$refs.dialoginfo.toggle()
            self.updateUser()
          } else {
            self.$refs.dialoginfo.setMessage(
              'Erreur lors de la supression'
            )
            self.$refs.dialoginfo.setHeading('Erreur')
            self.$refs.dialoginfo.toggle()
          }
        })
    }
  },
  mounted () {
    var self = this
    axios.get(process.env.VUE_APP_API_URL + '/isAdmin').then(function (response) {
      if (!response.data.isAdmin) {
        self.$router.push('/')
      }
    })
    axios.get(process.env.VUE_APP_API_URL + '/users').then(function (response) {
      self.users = response.data
    })
  },
  components: {
    'dialog-info': Dialog
  }
}
</script>
