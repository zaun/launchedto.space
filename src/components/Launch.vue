<template>
  <div class="launch" :class="status">
    <div :class="launchClasses"></div>
    <div class="detail">
      <div class="media" v-if="hasMedia" @click="showImages"></div>
      <h1>{{ launch.vehicle }}</h1>
      <h2>{{ formatDate(launch.date) }}</h2>
      <div class="payload-list">
        <h3 v-for="(payload, index) in launch.payloads" :key="`payload-${index}`" >{{ payload.name }}</h3>
      </div>
    </div>
    <div :class="payloadClasses(payload, index)" v-for="(payload, index) in launch.payloads" :key="`satellite-${index}`" :title="payload.name"></div>

    <v-dialog v-model="launchImagesDisplayed" max-width="50rem">
      <carousel v-if="launchImagesDisplayed" :autoplay="true" :autoplayTimeout="10000" :autoplayHoverPause="true" :perPage="1" :loop="true">
        <slide v-for="(item, index) in launchImages" :key="`img-${index}`" :style="backgroundStyle(item)">
          <div class="description">{{ item.description }}</div>
        </slide>
      </carousel>
    </v-dialog>    
  </div>
</template>

<script>
import moment from 'moment';
import { Carousel, Slide } from 'vue-carousel';

export default {
  name: 'Launch',
  props: {
    launch: Object,
  },

  components: {
    Carousel,
    Slide
  },

  data: function () {
    return {
      launchImagesDisplayed: false,
    };
  },

  computed: {
    status () {
      return this.launch.status.replace(new RegExp(' ', 'g'), '_').toLowerCase();
    },

    launchClasses () {
      let classes = 'rocket ';
      classes += this.launch.vehicle.toLowerCase()
                    .replace(new RegExp(' ', 'g'), '_')
                    .replace(new RegExp('\\.', 'g'), '_')
                    .replace(new RegExp('/', 'g'), '_')
                    .replace(new RegExp('\\(', 'g'), '')
                    .replace(new RegExp('\\)', 'g'), '');
      return classes;
    },

    hasMedia () {
      return this.$store.state.mediaByLaunch[this.launch.id] && this.$store.state.mediaByLaunch[this.launch.id].length > 0;
    },

    launchImages () {
      if (!this.$store.state.mediaByLaunch[this.launch.id]) {
        return [];
      }

      return this.$store.state.mediaByLaunch[this.launch.id].map((i) => {
        return {
          src: '/img/' + i.filename,
          description: i.description
        };
      });
    }
  },

  methods: {
    showImages() {
      this.launchImagesDisplayed = true;
    },

    backgroundStyle(image) {
      let style = 'background-image: url(' + image.src + ');';
      style += 'background-size: contain !important;';
      style += 'background-position: center;';
      return style;
    },

    formatDate(date) {
      return moment(date).format('MMMM Do');
    },

    formatLongDate(date) {
      return moment(date).format('MMMM Do, YYYY');
    },

    payloadClasses (payload, index) {
      let classes = 'orbital';

      if (payload.type) {
        classes += ' ' + payload.type.toLowerCase();
      } else {
        classes += ' satellite';
      }

      if (payload.orbit) {
        classes += ' ' + payload.orbit.toLowerCase();
      } else {
        classes += ' hidden';
      }

      if (payload.status) {
        classes += ' ' + payload.status.replace(new RegExp(' ', 'g'), '_').toLowerCase();
      } else {
        classes += ' ' + this.launch.status.replace(new RegExp(' ', 'g'), '_').toLowerCase();
      }

      classes += ' cols' + Math.ceil(this.launch.payloads.length / 3);
      classes += ' idx' + index;

      return classes;
    }
  }
};
</script>

<style scoped lang="stylus">
.launch
  position relative
  padding-left 2.5rem
  width 100%
  height 11rem
  top 0

  .dialog
    .VueCarousel
      width 50rem
      height 50rem
      .description
        position absolute
        bottom 0
        padding 1em 1em 50px 1em
        background-color rgba(0,0,0,0.75)
        opacity 0.05
      &:hover
        .description
          color: white;
          opacity 1

  .detail
    position absolute
    top 0px
    width 10rem
    height 11rem
    padding 0.3em
    overflow hidden
    border-bottom 1px solid black
    border-top 1px solid black

    .payload-list
      height 8rem
      overflow-y scroll
    
    .media
      position absolute
      top 0px
      right 1px
      width 1.9rem
      height 1.9rem
      background-image url('../assets/rocket.svg')
      z-index 2

    h1
      position relative
      font-size 1rem
      font-weight 600
      line-height 1.1
      text-align center
      margin 0.4em
      margin-top 0
      padding 0

    h2
      position relative
      font-size 0.7rem
      font-weight 600
      line-height 1.1
      text-align center
      margin 0.4em
      padding 0

    h3
      position relative
      font-size 0.7rem
      font-weight 300
      line-height 1.1
      text-align center
      margin 0.2em
      padding 0

  .rocket
    margin-left 10.5rem
    height 100%
    width 1100px
    background-size contain
    background-repeat no-repeat
    background-position center

    // 100m = 55rem
    // (<height> / 100) * 55

    &.saturn-5
      width 56.1rem
      background-image url('../assets/vehicles/saturn-v.png')

    &.saturn-5a
      width 56.1rem
      background-image url('../assets/vehicles/saturn-v.png')

    &.falcon-1_dev
      width 11.715rem
      background-image url('../assets/vehicles/falcon-1.png')

    &.falcon-1
      width 11.715rem
      background-image url('../assets/vehicles/falcon-1.png')

    &.grasshopper
      width 6.765rem
      background-image url('../assets/vehicles/grasshopper.png')

    &.falcon-9r-dev-1
      width 6.71rem
      background-image url('../assets/vehicles/falcon-9r-dev-1.png')

    &.falcon-9_v1_0
      width 30.195rem
      background-image url('../assets/vehicles/falcon-9_v1-0.png')

    // v1.1 w/o dragon
    &.falcon-9_v1_1
      width 37.62rem
      background-image url('../assets/vehicles/falcon-9_v1-1.png')

    // v1.1 w/ dragon
    &.falcon-9_v1_1a
      width 34.485rem
      background-image url('../assets/vehicles/falcon-9_v1-1-dragon.png')

    // v1.1 w/ dragon w/o landing legs
    &.falcon-9_v1_1b
      width 34.485rem
      background-image url('../assets/vehicles/falcon-9_v1-1-dragon-expendable.png')

    // v1.1 w/o landing legs
    &.falcon-9_v1_1c
      width 37.62rem
      background-image url('../assets/vehicles/falcon-9_v1-1-expendable.png')

    // v1.2 w/o dragon
    &.falcon-9_v1_2
      width 37.62rem
      background-image url('../assets/vehicles/falcon-9_v1-1.png')

    // v1.2 w/ dragon
    &.falcon-9_v1_2a
      width 34.485rem
      background-image url('../assets/vehicles/falcon-9_v1-1-dragon.png')

    // v1.2 w/ dragon w/o landing legs
    &.falcon-9_v1_2b
      width 34.485rem
      background-image url('../assets/vehicles/falcon-9_v1-1-dragon-expendable.png')

    // v1.2 w/o landing legs
    &.falcon-9_v1_2c
      width 37.62rem
      background-image url('../assets/vehicles/falcon-9_v1-1-expendable.png')

    // v1.2 heavy
    &.falcon-9_heavy
      width 37.62rem
      background-image url('../assets/vehicles/falcon-9_heavy.png')

  .orbital
    position absolute
    top 50%
    right calc(5rem - 2rem)
    width 1.9rem
    height 1.9rem
    background-position center
    transform translateY(-50%)

    &.satellite
      background-image url('../assets/noun_724999_cc.svg')

    &.capsule
      background-image url('../assets/noun_1671108_cc.svg')

    &.station
      background-image url('../assets/noun_744249_cc.svg')

    &.hidden
      display none

    &.failure
      opacity 0.3

    &.karmen
      right calc(25rem - 2rem)

    &.sso,
    &.leo
      right calc(20rem - 2rem)

    &.meo
      right calc(15rem - 2rem)

    &.geo
      right calc(10rem - 2rem)

    &.cols1
      &.idx0
        margin-right 0rem

      &.idx1
        margin-right -1.5rem

      &.idx2
        margin-right -3rem

    &.cols2
      &.idx0
        margin-right 0rem
        margin-top -1rem

      &.idx1
        margin-right -1.5rem
        margin-top -1rem

      &.idx2
        margin-right -3rem
        margin-top -1rem

      &.idx3
        margin-right 0rem
        margin-top 1rem

      &.idx4
        margin-right -1.5rem
        margin-top 1rem

      &.idx5
        margin-right -3rem
        margin-top 1rem

    &.cols3
      &.idx0
        margin-right 0rem
        margin-top -2rem

      &.idx1
        margin-right -1.5rem
        margin-top -2rem

      &.idx2
        margin-right -3rem
        margin-top -2rem

      &.idx3
        margin-right 0rem
        margin-top 0rem

      &.idx4
        margin-right -1.5rem
        margin-top 0rem

      &.idx5
        margin-right -3rem
        margin-top 0rem

      &.idx6
        margin-right 0rem
        margin-top 2rem

      &.idx7
        margin-right -1.5rem
        margin-top 2rem

      &.idx8
        margin-right -3rem
        margin-top 2rem

    &.cols4
      &.idx0
        margin-right 0rem
        margin-top -3rem

      &.idx1
        margin-right -1.5rem
        margin-top -3rem

      &.idx2
        margin-right -3rem
        margin-top -3rem

      &.idx3
        margin-right 0rem
        margin-top -1rem

      &.idx4
        margin-right -1.5rem
        margin-top -1rem

      &.idx5
        margin-right -3rem
        margin-top -1rem

      &.idx6
        margin-right 0rem
        margin-top 1rem

      &.idx7
        margin-right -1.5rem
        margin-top 1rem

      &.idx8
        margin-right -3rem
        margin-top 1rem

      &.idx9
        margin-right 0rem
        margin-top 3rem

      &.idx10
        margin-right -1.5rem
        margin-top 3rem

      &.idx11
        margin-right -3rem
        margin-top 3rem

.launch.partial_failure
  .detail
    background-color rgba(255,0,0,0.1)

.launch.failure
  .detail
    background-color rgba(255,0,0,0.2)
</style>
