<template>
  <div class="home">
    <Background />
    <div class="launches" @scroll="handleScroll">
      <div class="header">
      </div>

      <div class="group" v-for="(launches, year) in launchesByYear" :key="`year-${year}`">
        <div class="title">
          <div class="year">{{ year }}</div>
        </div>
        <Launch v-for="(launch, index) in launches" :key="`launch-${index}`" :launch="launch" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Background from '@/components/Background.vue';
import Launch from '@/components/Launch.vue';
import { filter, groupBy } from 'lodash';

export default {
  name: 'home',

  components: {
    Background,
    Launch,
  },

  data: function () {
    return {
      launchesByYear: { },
    };
  },

  created () {
    const url = '/data.json';
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        this.launchesByYear = _(data).filter((l) => {
          return l.date.length > 0;
        }).groupBy((l) => {
          return l.date.split('-')[0];
        }).value();
      })
      .catch(function(error) {
        console.log('err', error);
      });
  },

  methods: {
    handleScroll () {
      const header = document.querySelector('.launches .header');
      const fadeAt = header.scrollHeight * 1.4;
      const orbitals = document.querySelectorAll('.orbital');
      const fadeIn = 45;
      
      _.each(orbitals, (o) => {
        const offsets = o.getBoundingClientRect();
        if (offsets.top < fadeAt + fadeIn) {
          let fade = (fadeAt + fadeIn) - offsets.top
          if (fade > fadeIn) {
            fade = fadeIn;
          }
          const opacity = 1 - (fade / fadeIn);
          o.style.opacity = opacity;
        } else {
          o.style.opacity = null;
        }
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.home
  position absolute
  height 100%
  width 100%
  z-index 1

  .launches
    position relative
    height calc(100% - 56px)
    width 100%
    margin-top 56px
    padding-bottom 5rem
    overflow scroll

    .header
      height 13rem

    .group 
      position relative

      .title
        position absolute
        float left
        width 2.5rem
        height 100%
        border-bottom 1px solid black
        border-top 1px solid black
        border-right 1px solid black

        .year
          position absolute
          font-size 1.2rem
          top 50%
          transform translateY(-50%) rotate(90deg)
</style>
