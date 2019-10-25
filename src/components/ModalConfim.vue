<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <template v-slot:activator="{ on }">
      </template>
      <v-card>
        <v-card-title class="headline">{{ heading }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" v-if='view' text @click="dialog = false">{{ cancelText }}</v-btn>
          <v-btn color="green darken-1" text @click="confirm">{{ confirmText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      dialog: false,
      message: '',
      heading: '',
      confirmUrl: '',
      cancelText: 'Annuler',
      confirmText: 'Confirmer',
      view: true
    }
  },
  methods: {
    confirm () {
      this.dialog = false
      axios.get(this.confirmUrl).then(function (response) {
        if (response.data.status === 'success') {
          this.view = false
          this.setHeading('Succès')
          this.setMessage('Compte supprimé avec succès')
          this.confirmText = 'Ok'
          this.dialog = true
        }
      })
    },
    cancel () {
      this.dialog = false
    },
    toggle () {
      this.dialog = true
    },
    setMessage (text) {
      this.message = text
    },
    setHeading (text) {
      this.heading = text
    },
    setConfirmUrl (text) {
      this.confirmUrl = text
    }
  }
}
</script>
