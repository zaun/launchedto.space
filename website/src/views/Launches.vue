<template>
  <div ref="launches" id="launches" :class="this.$vuetify.breakpoint.name">
    <!-- <Background /> -->
    <section class="year" v-for="(year) in years" :key="`year-${year}`" v-if="isReady && sortedLaunches(year).length">
      <h3>{{year}}</h3>
      <launch v-for="(launch, index) in sortedLaunches(year)" :key="`launch-${index}`" :launch="launch" />
    </section>
    <div class="text-xs-center" v-if="!isReady">
      <v-progress-circular
        :size="70"
        :width="7"
        color="teal"
        indeterminate
        :top="7"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {
  includes, groupBy, keys, sortBy, reverse,
} from 'lodash';
import Background from '@/components/Background.vue';
import Launch from '@/components/Launch.vue';

export default {
  name: 'launches',

  components: {
    Background,
    Launch,
  },

  data() {
    return {
      isMounted: false,
      position: 0,
    };
  },

  computed: {
    launchesByYear() { return this.$store.getters.launchesByYear; },
    years() { return reverse(keys(this.$store.getters.launchesByYear)); },
    isReady() { return this.$store.state.isReady; },
  },

  methods: {
    sortedLaunches(year) {
      return reverse(sortBy(this.launchesByYear[year], 'date'));
    },
  },
};
</script>

<style scoped lang="stylus">
#launches
  width 100%

  &.xs
    h3
      transform rotate(270deg) translateX(-1rem) translateY(-2rem)

  .v-progress-circular
    margin-top 5rem;

  .year
    position relative
    max-width 600px
    padding 0 6px
    margin-left auto
    margin-right auto

    h3
      position sticky
      float left
      top 64px
      font-size 1.5em
      font-weight 400
      height 0px
</style>
