<template>
  <v-app>
    <v-toolbar dense fixed app class="app-toolbar">
      <v-toolbar-title class="hidden-xs-only">Launched To Space</v-toolbar-title>
      <v-toolbar-title class="hidden-sm-and-up">L2S</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat to="launches">Launches</v-btn>
        <v-btn flat to="rockets">Rockets</v-btn>
        <v-btn flat @click="showFilter = true">
          <v-icon>fas fa-filter</v-icon>
        </v-btn>
        <v-btn flat href="https://github.com/zaun/launchedto.space" class="hidden-sm-and-down">
          <v-icon>fab fa-github</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <div class="toolbar-spacer"></div>

    <v-dialog v-model="showFilter" persistent no-click-animation max-width="500px">
      <v-card>
        <v-toolbar flat dark color="teal">
          <v-toolbar-title class="white--text">
            Filter
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-layout row>
            <v-flex xs12>
              <v-select v-model="filter.years" :items="yearOptions" label="Years" clearable multiple class="pr-1"></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-select :value="filterFamilies" @input="updateFilterFamilies" :items="familyOptions" label="Rocket Families" clearable multiple class="pr-1"></v-select>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-footer height="auto">
          <v-spacer></v-spacer>
          <v-btn @click="showFilter = false">Close</v-btn>
        </v-footer>
      </v-card>
    </v-dialog>
    
    <router-view/>
  </v-app>
</template>

<script>
// @ is an alias to /src
import { keys, map, uniq, reverse, sortBy } from 'lodash';
import moment from 'moment';
import Background from '@/components/Background.vue';

export default {
  name: 'home',
  components: {
    Background,
  },

  data () {
    return {
      showFilter: false,

      filter: {
        years: [],
      },
    };
  },

  computed: {
    families () { return sortBy(this.$store.getters.families, 'name'); },
    launches () { return this.$store.getters.launches; },

    familyOptions () {
      return this.$store.getters.familyOptions;
    },

    yearOptions () {
      return reverse(uniq(map(this.launches, (l) => moment(l.date).format('YYYY'))).sort());
    },

    filterFamilies () {
      return this.$store.state.filter.familyNames;
    },
  },

  methods: {
    selectVehicle(v) {
      this.selectedVehicle = v;
    },

    updateFilterFamilies (value) {
      this.$store.commit('updateFilter', {
        prop: 'families',
        value: value,
      });
    },
  },

  created () {
    this.$store.dispatch('loadData');
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

.small
  font-size 0.85em

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
  
  .v-card__text
    background-color white
    &.hero
      padding 0
      margin 0
      > img
        display block
        width 100%
        cursor pointer

iframe
  display block
  background-color black

@media screen and (max-width: 480px)
  html, body
    font-size 12pt

@media screen and (min-width: 480px)
  html, body
    font-size 14pt
</style>
