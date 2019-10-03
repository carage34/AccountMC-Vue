<template>
  <v-app>
    <v-container>
      <v-card>
        <v-card-text>
          <h2>S'inscrire</h2>
          <v-form>
            <v-text-field label="Pseudo" v-model="pseudo" :rules="[rules.minLength]"></v-text-field>
            <v-text-field
             type='password'
              label="Mot de passe"
              v-model="pass"
              :rules="[rules.minLength]"
            ></v-text-field>
            <v-text-field
             type='password'
              label="Confirmer le mot de passe"
              v-model="confirmpass"
              :rules="passConfirmation"
            ></v-text-field>
            <v-btn flat class="sucsess" @click="submit">Valider</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      pseudo: '',
      pass: '',
      confirmpass: '',
      rules: {
        minLength: v => v.length >= 3 || 'Votre saisie est plus courte que 3 caractères'
      }
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        console.log(this.pseudo)
        console.log(this.pass)
      }
    }
  },
  computed: {
    passConfirmation () {
      return [
        () => (this.pass === this.confirmpass) || 'Les mots de passe ne correspondent pas'
        
      ]
    }
  }
}
</script>
