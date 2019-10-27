<template>
<v-app>
  <v-container>
    <dialog-info ref="dialoginfo" :msg="true">
    </dialog-info>
        <v-card>
        <v-card-text>
          <h2>S'inscrire</h2>
          <v-form ref="form">
            <v-text-field prepend-icon="mdi-account-circle" label="Pseudo" v-model="pseudo" :rules="[rules.required]"></v-text-field>
            <v-text-field
            prepend-icon="mdi-lock-alert"
             type='password'
              label="Mot de passe"
              v-model="pass"
              :rules="[rules.required]"
            ></v-text-field>
            <v-btn flat class="success" @click="submit">Valider</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
  </v-container>
</v-app>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import VueSession from 'vue-session'
import Dialog from '../components/Dialogue'
Vue.use(VueSession)
export default {
  data () {
    return {
      pseudo: '',
      pass: '',
      confirmpass: '',
      rules: {
        required: v => !!v || 'Champ requis'
      }
    }
  },
  methods: {
    submit () {
      var self = this
      if (this.$refs.form.validate()) {
        console.log(this.pseudo)
        console.log(this.pass)
        var data = {
          pseudo: this.pseudo,
          password: this.pass
        }
        var headers = {
          'Content-Type': 'application/json'
        }
        axios.post('http://localhost:5555/login', data, {
          headers: headers
        }).then(function (response) {
          console.log(response.data.auth)
          if (response.data.auth === 'failed') {
            self.$refs.dialoginfo.setMessage(response.data.error)
            self.$refs.dialoginfo.setHeading('Authentification')
            self.$refs.dialoginfo.toggle()
          } else {
            var tmp = false
            console.log('response ' + response.data.admin)
            if (response.data.admin === 1) {
              tmp = true
              self.$store.commit('change', tmp)
            }
            console.log(tmp)
            console.log(self.$store.getters.admin)
            self.$session.start()
            self.$session.set('pseudo', self.pseudo)
            self.$router.push('/')
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  },
  mounted () {
    axios.get('http://localhost:5555/api').then(function (response) {
      console.log(response.data)
    })
  },
  components: {
    'dialog-info': Dialog
  }
}
</script>
