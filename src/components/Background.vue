<template>
  <div class="background" :class="mode">
    <div class="spacer"></div>
    <div class="space">
      <div class="orbit karmen"></div>
      <div class="orbit leo">
        <div class="iss"></div>
      </div>
      <div class="orbit meo"></div>
      <div class="orbit geo"></div>
      <div class="orbit to"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Background',
  props: {
    mode: String,
  },
};
</script>

<style scoped lang="stylus">
.background
  position absolute
  height 100%
  width 100%
  white-space nowrap
  font-size 0
  z-index -2
  margin-top 56px

  &.cover
    height 13rem
    z-index 2

.spacer
  display inline-block
  height 100%
  width calc(100% - 500px)

.space
  display inline-block
  height 100%
  background linear-gradient(to left, rgba(175,175,175,1) 0%,rgba(255,255,255,1) 100%)

.orbit
  position relative
  display inline-block
  height 100%
  width 100px
  font-size 1rem
  border-left 1px solid black

.orbit::before
  position absolute
  top 0px
  padding-left 20px
  margin-left 1.1em
  white-space pre
  transform-origin top left
  transform rotate(90deg)

.orbit::after
  position absolute
  top 0px
  padding-left 20px
  margin-left -0.1em
  white-space pre
  transform-origin top left
  transform rotate(90deg)
  opacity 0.5

.orbit.karmen::before
  content "K\00E1rm\00E1n Line"

.orbit.karmen::after
  content "100 km"

.orbit.leo::before
  content "Low Earth Orbit"

.orbit.leo::after
  content "160 km"

.orbit.meo::before
  content "Medium Earth Orbit"

.orbit.meo::after
  content "2,000 km"

.orbit.geo::before
  content "Geosynchronous and \AGeostationary Orbits"
  margin-left 2.2em

.orbit.geo::after
  content "35,786 km"

.orbit.to::before
  content "Transfer Orbit \AHeliocentric Orbit \AHighly Elliptical Orbit"
  margin-left: 3.3em

.cover
  .orbit.to
    width 90px

.orbit .iss
  position absolute
  width 2.5em
  height 2.5em
  margin-top 150px
  left 50%
  transform translate(-50%)
  background url('../assets/noun_956251_cc.svg')

.orbit .iss::after
  display block
  width 100%
  content 'International \ASpace \AStation'
  white-space pre
  font-size 0.5rem
  margin-top 100%
</style>
