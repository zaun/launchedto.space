<template>
  <div id="home">
    <Background />
    <div ref="launches" id="launches">
      <section class="year" v-for="(year) in years" :key="`year-${year}`">
        <h3>{{year}}</h3>
        <Launch v-for="(launch, index) in sortedLaunches(year)" :key="`launch-${index}`" :launch="launch" />
      </section>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Background from '@/components/Background.vue';
import Launch from '@/components/Launch.vue';
import { filter, groupBy, keys, sortBy, reverse } from 'lodash';

export default {
  name: 'home',

  components: {
    Background,
    Launch,
  },

  data: function () {
    return {
      isMounted: false,
      position: 0
    };
  },

  computed:  {
    launchesByYear () { return this.$store.state.launchesByYear; },
    years () { return reverse(keys(this.$store.state.launchesByYear)); }
  },

  methods: {
    sortedLaunches(year) {
      return reverse(sortBy(this.launchesByYear[year], 'date'));
    },
  },
};
</script>

<style scoped lang="stylus">
#home
  width 100%
  height calc(100% - 2.25em)
  overflow-y scroll

  #launches

    .year
      position relative
      max-width 600px
      margin-left auto 
      margin-right auto

      h3
        position sticky
        float left
        top 0rem
        padding 0.5em 0 0 0 
        font-size 1.5em
        font-weight 400
        height 0px
      
      .timeline-item
        margin-top -0.7em
        padding-top 0.7em
        border 1px solid black
</style>
