

<template>
  <v-app>
    <v-container>
      <dialog-info ref="dialoginfo" :msg="true"></dialog-info>
      <v-card>
        <v-card-text>
          <h2>Ajouter un compte</h2>
          <v-form ref="form">
            <v-text-field
              label="Email"
              type="email"
              v-model.trim="email"
              :rules="[rules.required, rules.emailRules, checkEmpty]"
            ></v-text-field>
            <v-text-field
              type="text"
              label="Nom"
              v-model.trim="nom"
              :rules="[rules.required, checkEmpty]"
            ></v-text-field>
            <v-text-field
              label="Mot de passe"
              type="password"
              v-model.trim="mdp"
              :rules="[rules.required,checkEmpty]"
            ></v-text-field>
            <v-text-field
              label="Position"
              type="text"
              v-model.trim="position"
              :rules="[rules.required,checkEmpty]"
            ></v-text-field>
            <v-btn class="success" @click="submit">Valider</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import Dialog from '../components/Dialogue'
export default {
  data() {
    return {
      email: "",
      nom: "",
      mdp: "",
      position: "",
      rules: {
        required: v => !!v || "Champ requis",
        emailRules: v => /.+@.+/.test(v) || "E-mail incorrect"
      }
    };
  },
  methods: {
    checkEmpty(field) {
      if (!field.replace(/\s/g, "").length) {
        return "Champs requis";
      } else {
        return false;
      }
    },
    submit() {
      var self = this
      if (this.$refs.form.validate()) {
        var data = {
          email: this.email,
          password: this.mdp,
          position: this.position,
          nom: this.nom
        };
        console.log(data);
        var headers = {
          "Content-Type": "application/json"
        };
        axios
          .post("http://localhost:5555/add", data, {
            headers: headers
          })
          .then(function(response) {
            console.log(response.data.auth);
            if (response.data.status == "failed") {
              self.$refs.dialoginfo.setMessage(response.data.error);
              self.$refs.dialoginfo.setHeading('Insertion d\'un nouveau compte')
              self.$refs.dialoginfo.toggle();
            } else {
              self.$router.push("/");
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  },
  computed: {},
  components: {
    "dialog-info": Dialog
  }
};
</script>