<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <template v-slot:activator="{ on }">

      </template>
      <v-card class="carte">
        <v-card-title class="headline">{{heading}}</v-card-title>
        <v-card-text>{{message}}</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="dialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: ['msg'],
  data () {
    return {
      dialog: false,
      message: '',
      heading: ''
    }
  },
  methods: {
    toggle () {
      this.dialog = true
    },
    setMessage (text) {
      this.message = text
    },
    setHeading (text) {
      this.heading = text
    }
  },
  mounted () {

  }
}
</script>
