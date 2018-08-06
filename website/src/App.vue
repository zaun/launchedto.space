<template>
  <v-app>
    <v-toolbar dense fixed app class="app-toolbar">
      <v-toolbar-title class="hidden-xs-only">Launched To Space</v-toolbar-title>
      <v-toolbar-title class="hidden-sm-and-up">L2S</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat to="launches">Launches</v-btn>
        <v-btn flat to="rockets">Rockets</v-btn>
        <v-btn flat href="https://github.com/zaun/launchedto.space" class="hidden-sm-and-down">
          <v-icon>fab fa-github</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <div class="toolbar-spacer"></div>

    <!-- <v-dialog v-model="about" max-width="500px">
      <v-toolbar color="indigo" dense>
        <v-toolbar-title class="white--text">About</v-toolbar-title>
      </v-toolbar>
      <div class="dialog-about_content pa-2">
        <div class="headline">Data</div>
        <ul class="ml-5">
          <li><a target="_blank" href="http://space.skyrocket.de/doc_lau/falcon-1.htm">Falcon-1</a> at Gunter's Space Page</li>
          <li><a target="_blank" href="http://space.skyrocket.de/doc_lau/falcon-9.htm">Falcon-9</a> at Gunter's Space Page</li>
          <li><a target="_blank" href="http://space.skyrocket.de/doc_lau/grasshopper.htm">Grasshopper</a> at Gunter's Space Page</li>
          <li><a target="_blank" href="http://space.skyrocket.de/doc_lau_fam/saturn.htm">Saturn</a> at Gunter's Space Page</li>
          <li><a target="_blank" href="http://www.astronautix.com/s/spacex.html">SpaceX</a> at Encyclopedia Astronautica</li>
        </ul>
        <div class="headline mt-3">Icons & Images</div>
        <ul class="ml-5">
          <li><a target="_blank" href="https://www.patreon.com/user?u=5775382">Spacecraft Vector Art</a> by Ezekiel</li>
          <li><a target="_blank" href="https://www.flaticon.com/free-icon/file-sharing_287699#term=image%20video&page=2&position=7">Media</a> by Nikita Golubev</li>
          <li><a target="_blank" href="https://www.flaticon.com/free-icon/astronaut-user_81468#term=astronaut&page=1&position=20">Astronaut</a> by Freepik</li>
          <li><a target="_blank" href="https://thenounproject.com/term/icon/724999/">Satellite</a> by Ralf Schmitzer</li>
          <li><a target="_blank" href="https://thenounproject.com/term/icon/956251/">ISS</a> by Viktor Korobkov</li>
          <li><a target="_blank" href="https://thenounproject.com/term/icon/1671108/">Capsule</a> by Brand Mania</li>
          <li><a target="_blank" href="https://thenounproject.com/term/icon/744249/">Station</a> by Eliricon</li>
        </ul>
        <div class="headline mt-3">Help Out</div>
        <ul class="ml-5 mr-5">
          <li>This project is hosted on <a target="_blank" href="https://github.com/zaun/launchedto.space">GitHub</a>. Please feel free to fork it and send pull requests.</li>
        </ul>
      </div>
      <v-footer height="auto">
        <v-spacer></v-spacer>
        <v-btn @click="hideAbout">Close</v-btn>
      </v-footer>
    </v-dialog> -->
    
    <router-view/>
  </v-app>
</template>

<script>
// @ is an alias to /src
import { keys } from 'lodash';
import Background from '@/components/Background.vue';

export default {
  name: 'home',
  components: {
    Background,
  },

  data () {
    return {
      about: false,
      selectedVehicle: 'All'
    };
  },

  computed: {
    vehicles() {
      const families = keys(this.$store.state.launchesByFamily).sort();
      families.unshift('All');
      return families;
    }
  },

  methods: {
    selectVehicle(v) {
      this.selectedVehicle = v;
    },

    showAbout () {
      this.about = true;
    },

    hideAbout () {
      this.about = false;
    }
  },

  created () {
    this.$store.dispatch('updateData');
  }
};
</script>

<style lang="stylus">
*
  box-sizing border-box
  cursor default
  
html, body
  margin 0
  padding 0
  font-size 14pt
  font-weight 300
  line-height 1.1

div
  position relative
  display block

table
  text-align left
  th
    padding 0 0.5rem
    font-size 0.9rem
    font-weight 500
    white-space nowrap
  td
    font-size 0.8rem
    padding 0 0.5rem

.center
  text-align center !important

.title
  font-size 1.2rem !important

.app-toolbar
  opacity 0.97
  z-index 99

.toolbar-spacer
  padding-top 48px

.vueperslides__inner
  background-color black

.vueperslides__slide
  background-size contain !important

.vueperslides__bullets
  z-index 20 !important


.v-card 
  &:after
    content ''
    display table
    clear both
  
  .v-card__text.hero
    padding 0
    margin 0
    > img
      display block
      width 100%
      cursor pointer

@media screen and (max-width: 480px)
  html, body
    font-size 12pt

@media screen and (min-width: 480px)
  html, body
    font-size 14pt
</style>
