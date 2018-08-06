<template>
  <div id="rockets" :class="this.$vuetify.breakpoint.name">
    <section class="family" v-for="(family) in families" :key="`family-${family.name}`" v-if="isReady">
      <h3>{{family.name}}</h3>
      <rocket v-for="(rocket, index) in family.rockets" v-if="getLaunchCount(rocket) > 0" :key="`rockets-${index}`" :rocket="rocket" />
    </section>
    <div class="text-xs-center" v-if="!isReady">
      <v-progress-circular
        :size="70"
        :width="7"
        color="teal"
        indeterminate
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
import Rocket from '@/components/Rocket.vue';
import { filter, groupBy, keys, sortBy, reverse } from 'lodash';

export default {
  name: 'rockets',

  components: {
    Rocket
  },

  data: function () {
    return {
    };
  },

  computed:  {
    families () { return sortBy(this.$store.state.families, 'name'); },
    launches () { return this.$store.state.launches; },
    isReady () { return this.$store.state.isReady; },
  },

  methods: {
    getLaunchCount(rocket) {
      return filter(this.launches, { vehicle: rocket.name }).length;
    }
  },
}
</script>

<style scoped lang="stylus">
#rockets
  width 100%
  padding-top 1rem;

  &.xs
    h3
      transform rotate(270deg) translateX(-5rem)  translateY(0rem) 

  .family
    position relative
    max-width 700px
    padding 0 6px
    margin-left auto 
    margin-right auto

    h3
      display inline-block
      position sticky
      float left
      top 64px
      font-size 1.5em
      font-weight 400
      height 0px
      width 0px
</style>
