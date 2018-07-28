<template>
  <div class="background">
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
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #fff
</style>
