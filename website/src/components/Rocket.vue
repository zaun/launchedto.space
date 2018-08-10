<template>
  <div class="rocket" :class="rocketClass">
    <div class="flipper">
      <v-card class="front">
        <v-toolbar card dark color="teal">
          <v-toolbar-title class="white--text">{{ rocket.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showBack = true">
            <v-icon>info</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-layout row wrap>
            <v-flex xs6>
              <table>
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
                <tr v-if="rocket.payloadType === 'Capsule'">
                  <th>Capsule Height:</th>
                  <td>{{ rocket.capsuleHeight || '-- ' }}<span class="small">m</span></td>
                </tr>
                <tr v-if="rocket.payloadType === 'Capsule'">
                  <th>Capsule Diameter:</th>
                  <td>{{ rocket.capsuleDiameter || '-- ' }}<span class="small">m</span></td>
                </tr>
                <tr v-if="rocket.payloadType === 'Fairing'">
                  <th>Fairing Height:</th>
                  <td>{{ rocket.fairingHeight || '-- ' }}<span class="small">m</span></td>
                </tr>
                <tr v-if="rocket.payloadType === 'Fairing'">
                  <th>Fairing Diameter:</th>
                  <td>{{ rocket.fairingDiameter || '-- ' }}<span class="small">m</span></td>
                </tr>
              </table>
            </v-flex>
            <v-flex xs6>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-toolbar dense flat color="teal lighten-5">
          <v-toolbar-title>Stages</v-toolbar-title>
        </v-toolbar>

        <v-card-text v-if="rocket.stages.length > 0">
          <v-tabs centered>
            <v-tab v-for="(stage, index) in rocket.stages" :key="`tab-${index}`">
              {{index + 1}}: {{stage.name}}
            </v-tab>
            <v-tab-item v-for="(stage, index) in rocket.stages" :key="`tabitem-${index}`">
              <v-layout row wrap>
                <v-flex sm6>
                  <table>
                    <tr>
                      <th>Empty Mass:</th>
                      <td>{{ stage.emptyMass || '-- ' }}<span class="small">kg</span></td>
                    </tr>
                    <tr>
                      <th>Gross Mass:</th>
                      <td>{{ stage.grossMass || '-- ' }}<span class="small">kg</span></td>
                    </tr>
                    <tr>
                      <th>Height:</th>
                      <td>{{ stage.height || '-- ' }}<span class="small">m</span></td>
                    </tr>
                    <tr>
                      <th>Diameter:</th>
                      <td>{{ stage.diameter || '-- ' }}<span class="small">m</span></td>
                    </tr>
                    <tr>
                      <th>Span:</th>
                      <td>{{ stage.span || stage.diameter ||'-- ' }}<span class="small">m</span></td>
                    </tr>
                    <tr>
                      <th>Burn Time:</th>
                      <td>{{ stage.burnTime || '-- ' }}<span class="small">s</span></td>
                    </tr>
                    <tr>
                      <th>Sea Lvl ISP:</th>
                      <td>{{ stage.seaLevelIsp || '-- ' }}</td>
                    </tr>
                    <tr>
                      <th>ISP:</th>
                      <td>{{ stage.isp || '-- ' }}</td>
                    </tr>
                    <tr>
                      <th>Thrust Vac:</th>
                      <td>{{ stage.thrustVac || '-- ' }}<span class="small">kN</span></td>
                    </tr>
                    <tr>
                      <th>Propellants:</th>
                      <td>{{ stage.propellants || '--' }}</td>
                    </tr>
                  </table>
                </v-flex>
                <v-flex sm6>
                  <table class="engines" v-if="stage.engines.length > 0">
                    <tr>
                      <th>Engine</th>
                      <th>Cnt.</th>
                      <th>Thrust <small>(ea)</small></th>
                    </tr>
                    <tr v-for="(engine, index) in stage.engines" :key="`engine-${index}`">
                      <td>{{ engine.name }}</td>
                      <td>{{ engine.count }}</td>
                      <td>{{ engine.thrustVac || '-- ' }}<small>kN</small></td>
                    </tr>
                  </table>
                </v-flex>
              </v-layout>
            </v-tab-item>
          </v-tabs>
        </v-card-text>

        <v-toolbar dense flat color="teal lighten-5">
          <v-btn flat v-if="rocket.astronautixURL" :href="rocket.astronautixURL" title="Astronautix">A</v-btn>
          <v-btn flat v-if="rocket.skyrocketURL" :href="rocket.skyrocketURL" title="Gunter's Space Page">SR</v-btn>
          <v-btn flat v-if="rocket.spacelaunchreportURL" :href="rocket.spacelaunchreportURL" title="Space Launch Report">SLR</v-btn>
          <v-btn flat v-if="rocket.wikipediaURL" :href="rocket.wikipediaURL" title="Wikipedia">W</v-btn>
        </v-toolbar>
      </v-card>

      <v-card class="back">
        <v-toolbar card dark color="teal">
          <v-toolbar-title class="white--text">{{ rocket.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showBack = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <table>
            <tr>
              <th>success</th>
              <td> {{ launchByStatus.success || 0 }} </td>
            </tr>
            <tr>
              <th>partial failure</th>
              <td> {{ launchByStatus['partial failure'] || 0 }} </td>
            </tr>
            <tr>
              <th>failure</th>
              <td> {{ launchByStatus.failure || 0 }} </td>
            </tr>
          </table>
        </v-card-text>

        <v-toolbar dense flat color="teal lighten-5">
          <v-toolbar-title>Launches</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <div class="launches">
            <table>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Status</th>
                <th>Launch Site</th>
              </tr>
              <tr v-for="(launch, index) in launches" :key="`launch-${index}`">
                <td>{{ index + 1 }})</td>
                <td>{{ formatDate(launch.date) }}</td>
                <td>{{ launch.status }}</td>
                <td>{{ launch.launchSite }}</td>
              </tr>
            </table>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { countBy, filter } from 'lodash';

export default {
  name: 'rocket',

  props: {
    rocket: Object,
  },

  data: function () {
    return {
      showBack: false,
    };
  },

  computed:  {
    launches () {
      return filter(this.$store.state.launches, { vehicle: this.rocket.id });
    },
    
    launchByStatus () {
      return countBy(this.launches, 'status'); 
    },

    rocketClass () {
      let classes = {
        flip: this.showBack
      };
      classes[this.$vuetify.breakpoint.name] = true;
      return classes
    }
  },

  methods: {
    formatDate (date) {
      return moment(date).format('MMMM Do, YYYY');
    },
  },
};
</script>

<style scoped lang="stylus">
left-padding = 6rem
left-padding-xs = 3rem

.rocket
  position relative
  margin-top 1rem
  margin 0 0 1.5rem left-padding
  perspective 1000px

  &.xs
    margin 0 0 1.5rem left-padding-xs

    .default-image
      display none

  &.flip .flipper
    transform rotateY(180deg)

  .flipper
    transition 0.6s
    transform-style preserve-3d
    position relative

  .v-card
    font-size 1rem
    backface-visibility hidden
    z-index 2
    transform rotateY(0deg)
    
    &:after
      content ''
      display table
      clear both

    &:last-child
      margin-bottom 0
      padding-bottom 0

    &.back
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      z-index 1
      transform rotateY(180deg)

    .launches 
      margin-left 0.5rem
      height 475px
      overflow-y auto

    .default-image
      width 100%
      max-height 191px
      object-fit scale-down
      object-position 100% 0%
</style>
