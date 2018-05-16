<template>
  <v-app id="app">
    <v-toolbar  class="pl-0">
      <v-toolbar-title>launchedto.space (editor)</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat to="/sites">Sites</v-btn>
        <v-btn flat to="/rockets">Rockets</v-btn>
        <v-btn flat to="/launches">Launches</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content fluid class="ml-2 mr-2 mt-2">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'editor',

    created() {
      this.$store.dispatch('updateData');
    },
  };
</script>

<style>
  /* CSS */
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .toolbar {
    z-index: 3;
  }

  .content {
    padding-bottom: 0px !important;
  }
  
  </style>
