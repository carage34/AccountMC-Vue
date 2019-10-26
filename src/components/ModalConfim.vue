<template>
  <v-row justify='center'>
    <v-dialog v-model='dialog' persistent max-width='290'>
      <template v-slot:activator='{ on }'></template>
      <v-card>
        <v-card-title class='headline'>{{ heading }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color='green darken-1' v-if='view' text @click='dialog = false'>{{ cancelText }}</v-btn>
          <v-btn color='green darken-1' text @click='confirm'>{{ confirmText }}</v-btn>
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
      view: true,
      second: 0,
      id: 0
    }
  },
  methods: {
    confirm () {
      if (this.second === 0) {
        var self = this
        axios.get(this.confirmUrl).then(function (response) {
          if (response.data.status === 'success') {
            self.second = 1
            self.view = false
            self.setHeading('Succès')
            self.setMessage('Compte supprimé avec succès')
            self.confirmText = 'Ok'
            self.dialog = true
            self.$emit('del-acc', self.id)
          }
        })
      } else {
        this.dialog = false
      }
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
    setConfirmUrl (text, idd) {
      this.confirmUrl = text
      this.id = idd
    }
  }
}
</script>
