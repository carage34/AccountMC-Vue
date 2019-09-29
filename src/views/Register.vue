<template>
  <v-app>
    <v-container>
      <v-card>
        <v-card-text>
          <h2>S'inscrire</h2>
          <v-form>
            <v-text-field label="Pseudo" v-model="pseudo" prepend-icon="user" :rules="inputRules"></v-text-field>
            <v-text-field
              label="Mot de passe"
              v-model="pass"
              prepend-icon="password"
              :rules="inputRules"
            ></v-text-field>
            <v-text-field
              label="Confirmer le mot de passe"
              v-model="confirmpass"
              prepend-icon="password"
              :rules="inputRules"
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
      inputRules: [
        v => v.length >= 3 || 'Votre saisie est plus courte que 3 caractères'
      ]
    }
  },
  methods: {
    submit () {
      console.log(this.pseudo)
      console.log(this.pass)
    }
  }
}
</script>
