<template>
  <div class="home">
    <p>Page d'accueil</p>
    <p>{{pseudo}}</p>
  </div>
</template>

<script>
import Vue from 'vue'
import VueSession from 'vue-session'
Vue.use(VueSession)
export default {
  data() {
    return {
      pseudo: ""
    }
  },
  methods: {
    init () {
      if(this.$session.has("pseudo")) {
        this.pseudo = this.$session.get("pseudo");
      }
    }
  },
  mounted(){
    this.init();
  },
  name: 'home',
  components: {

  }
}
</script>
