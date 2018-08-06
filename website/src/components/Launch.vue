<template>
  <section class="launch" :id="`l-${launch.id}`" :class="`status_${launch.status.replace(' ', '_')} ${this.$vuetify.breakpoint.name}`">
    <v-card>
      <v-card-text v-if="hasMedia" class="hero" @click="launchImagesDisplayed = true">
        <img :src="defaultMedia" />
      </v-card-text>
      
      <v-toolbar flat dark color="teal">
        <v-toolbar-title class="white--text">
          {{ formatDate(launch.date) }}
          <div class="subheading">{{ launch.launchSite }}<span v-if="launch.launchPad"> at {{ launch.launchPad  }}</span></div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="isManned" class="manned"></div>
      </v-toolbar>

      <v-card-text v-if="1==0">
        <goodshare-facebook
          :page_url="shareURL"
          :page_title="shareTitle"
          has_counter
          has_icon
        >
        </goodshare-facebook>
        <goodshare-reddit
          :page_url="shareURL"
          :page_title="shareTitle"
          has_counter
          has_icon
        >
        </goodshare-reddit>
      </v-card-text>

      <v-card-text>
        <div>
          <table>
            <tr>
              <th>Status:</th>
              <td>{{ status }}</td>
            </tr>
            <tr>
              <th>Rocket:</th>
              <td>{{ rocket.name }}</td>
            </tr>
            <tr v-if="launch.serial">
              <th>Serial:</th>
              <td>{{ launch.serial }}</td>
            </tr>
            <tr>
              <th>Expendable:</th>
              <td>{{ rocket.expendable === 'yes' ? 'Yes' : 'No' }}</td>
            </tr>
            <tr>
              <th>Payload Type:</th>
              <td>{{ rocket.payloadType }}</td>
            </tr>
            <tr>
              <th>Height:</th>
              <td>{{ rocket.height }}<span class="small">m</span></td>
            </tr>
            <tr v-if="rocket.diameter">
              <th>Diameter:</th>
              <td>{{ rocket.diameter }}<span class="small">m</span></td>
            </tr>
            <tr class="item" v-if="rocket.span">
              <th>Span:</th>
              <td>{{ rocket.span }}<span class="small">m</span></td>
            </tr>
          </table>
        </div>
      </v-card-text>

      <v-toolbar dense flat color="teal lighten-5" v-if="launch.payloads.length > 0">
        <v-toolbar-title>Payload</v-toolbar-title>
      </v-toolbar>

      <v-card-text v-if="launch.payloads.length > 0">
        <ul class="payload small">
          <li v-for="(payload, index) in sortedPayload" :key="`payload-${index}`" :class="payload.type">
            {{ payload.name }}
          </li>
        </ul>
      </v-card-text>

      <!-- <div v-if="hasMedia">
        <div v-for="(img, index) in launchImages" :key="`img-${index}`" :style="backgroundStyle(img)" class="media">
        </div>
      </div> -->
    </v-card>

    <v-dialog v-model="launchImagesDisplayed" lazy :scrollable="false">
      <div class="close" @click="closeSlideshow()"></div>
      <vueper-slides
        v-if="launchImagesDisplayed"
        fade
        slide-content-outside="top"
        slide-content-outside-class="max-widthed"
        :autoplay="true"
        :speed="3000"
        :pauseOnHover="false"
        :arrows="false"
        :touchable="false"
        :slide-ratio="0.8"
      >
        <vueper-slide v-for="(item, index) in launchImages" :key="`img-${index}`" :image="slideSrc(item)">
        </vueper-slide>
      </vueper-slides>
    </v-dialog>
  </section>
</template>

<script>
import moment from 'moment';
import { find, sortBy } from 'lodash';
import { VueperSlides, VueperSlide } from 'vueperslides';
import GoodshareFacebook from 'vue-goodshare/src/providers/Facebook.vue'
import GoodshareReddit from 'vue-goodshare/src/providers/Reddit.vue'

export default {
  name: 'launch',

  props: {
    launch: Object,
  },

  components: {
    VueperSlides,
    VueperSlide,
    GoodshareFacebook,
    GoodshareReddit,
  },

  data: function () {
    return {
      isMounted: false,
      maxHeight: 0,

      launchImagesDisplayed: false,
    };
  },

  computed: {
    sortedPayload() {
      return sortBy(this.launch.payloads, 'name');
    },

    hasMedia () {
      return this.$store.state.mediaByLaunch[this.launch.id] && this.$store.state.mediaByLaunch[this.launch.id].length > 0;
    },

    isManned () {
      return this.launch.manned === "yes";
    },

    launchImages () {
      if (!this.$store.state.mediaByLaunch[this.launch.id]) {
        return [];
      }

      return this.$store.state.mediaByLaunch[this.launch.id].map((i) => {
        return {
          src: '/thumb/' + i.filename,
          full: '/orig/' + i.filename,
          description: i.description,
          default: i.default,
        };
      });
    },

    defaultMedia () {
      let img = find(this.launchImages, { default: true });
      if (!img) {
        img = this.launchImages[0];
      }
      return `/media${img.src}`;
    },

    family () {
      return _.find(this.$store.state.families, { name: this.launch.vehicleFamily });
    },

    rocket () {
      return _.find(this.family.rockets, { name: this.launch.vehicle });
    },

    status () {
      return this.launch.status.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },

    shareTitle () {
      return `${this.family.name} launch at ${this.launch.launchSite} on ${this.formatDate(this.launch.date)}`;
    },

    shareURL () {
      return `${location.origin}/#/#l-${this.launch.id}`;
    },
  },

  methods: {
    slideSrc(image) {
      return `/media${image.full}`;
    },

    formatDate(date) {
      return moment(date).format('MMMM Do, YYYY');
    },

    closeSlideshow() {
      this.launchImagesDisplayed = false;
    },
  },

  mounted() {
    this.isMounted = true;
  },
};
</script>

<style scoped lang="stylus">
left-padding = 4.5rem
left-padding-xs = 2.5rem
dot-size = 0.75
line-width = 4

half-dot-size = dot-size / 2
half-line-width = line-width / 2

.close
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  z-index 10
  color white

.launch
  position relative
  padding 0 0 1.5rem left-padding
  margin-top 1rem

  &.xs
    padding 0 0 1.5rem left-padding-xs

  &:after
    content ''
    width line-width px
    position absolute
    top -1rem
    bottom 0rem
    left "calc(%s - 1rem + %sem - %spx)" % (left-padding half-dot-size half-line-width)
    z-index 1
    background #C5C5C5

  &.xs:after
    left "calc(%s - 1rem + %sem - %spx)" % (left-padding-xs half-dot-size half-line-width)

  &:before
    content ''
    width dot-size rem
    height dot-size rem
    background #C5C5C5
    border 2px solid #FFFFFF
    position absolute
    left "calc(%s - 1rem)" % left-padding
    top calc(0.5rem + 8px)
    z-index 2
    border-radius 100%
  
  &.xs:before
    left "calc(%s - 1rem)" % left-padding-xs

  &.status_success:before
    background green
  
  &.status_failure:before
    background #FF0000
  
  &.status_partial_failure:before
    background #FFA500

  .manned
    float right
    width 1.5rem
    height 1.5rem
    background-image url('../assets/manned.png')
    background-repeat no-repeat
    background-size contain
    background-position center


  .payload
    list-style-type none   
    column-width 8rem
    column-gap 0.2rem
    list-style-position inside

    li
      margin 0
      padding 0
      font-size 0.8rem
      white-space nowrap
      list-style: none;
    
      &:before
        content ''
        display inline-block
        padding: 0 0 1rem 1rem;
        vertical-align: middle;
        background-image: url('../assets/noun_724999_cc.svg')
        background-repeat no-repeat
        background-size contain
        background-position center
      
      &.Capsule:before
        background-image: url('../assets/noun_1671108_cc.svg')
      
      &.Station:before
        background-image: url('../assets/noun_744249_cc.svg')
</style>
