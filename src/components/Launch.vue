<template>
  <div class="launch" :class="status">
    <div :class="launchClasses"></div>
    <div class="detail">
      <h1>{{ launch.vehicle }}</h1>
      <h2>{{ launch.date }}</h2>
      <h3 v-for="(payload, index) in launch.payloads" :key="`payload-${index}`" >{{ payload.name }}</h3>
    </div>
    <div :class="payloadClasses(payload, index)" v-for="(payload, index) in launch.payloads" :key="`satellite-${index}`" :title="payload.name"></div>
  </div>
</template>

<script>
export default {
  name: 'Launch',
  props: {
    launch: Object,
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
    }
  },

  methods: {
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

  .detail
    position absolute
    top 0px
    width 10rem
    height 11rem
    padding 0.3em
    overflow hidden
    border-bottom 1px solid black
    border-top 1px solid black

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
      font-size 0.6rem
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

    &.saturn_v
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

.launch.partial_failure
  .detail
    background-color rgba(255,0,0,0.1)

.launch.failure
  .detail
    background-color rgba(255,0,0,0.2)
</style>
