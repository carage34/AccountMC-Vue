<style>
.carte {
  background: rgba(255, 255, 255, 0.90) !important;
}
</style>

<template>
  <v-app>
    <v-container>
      <dialog-info ref='dialoginfo'></dialog-info>
      <v-card class="carte">
        <v-card-text>
          <h2>S'inscrire</h2>
          <v-form ref='form'>
            <v-text-field label='Pseudo' v-model='pseudo' :rules='[rules.required, rules.minLength, checkEmpty]'></v-text-field>
            <v-text-field
             type='password'
              label='Mot de passe'
              v-model='pass'
              :rules='[rules.required, rules.minLength, checkEmpty]'
            ></v-text-field>
            <v-text-field
             type='password'
              label='Confirmer le mot de passe'
              v-model='confirmpass'
              :rules='[rules.required, rules.minLength, checkEmpty]'
            ></v-text-field>
            <v-btn class='success' @click='submit'>Valider</v-btn>
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
        minLength: v => v.length >= 3 || 'Votre saisie est plus courte que 3 caractères',
        required: v => !!v || 'Champ requis'
      }
    }
  },
  methods: {
    checkEmpty (field) {
      if (!field.replace(/\s/g, '').length) {
        return 'Champs requis'
      } else {
        return false
      }
    },
    submit () {
      var self = this
      if (this.$refs.form.validate()) {
        var data = {
          pseudo: this.pseudo,
          pass: this.pass,
          confirmpass: this.confirmpass
        }
        var headers = {
          'Content-Type': 'application/json'
        }
        axios.post(process.env.VUE_APP_API_URL + '/register', data, {
          headers: headers
        }).then(function (response) {
          if (response.data.status === 'success') {
            self.$session.start()
            self.$session.set('pseudo', self.pseudo)
            self.$router.push('/')
          } else {
            self.$refs.dialoginfo.setMessage(response.data.error)
            self.$refs.dialoginfo.setHeading('Erreur')
            self.$refs.dialoginfo.toggle()
          }
        }).catch(function (error) {
          throw error
        })
      }
    }
  },
  computed: {
    passConfirmation () {
      return [
        () => (this.pass === this.confirmpass) || 'Les mots de passe ne correspondent pas',
        v => !!v || 'Champ requis', v => v.length >= 3 || 'Votre saisie est plus courte que 3 caractères'
      ]
    }
  },
  components: {
    'dialog-info': Dialog
  }
}
</script>
