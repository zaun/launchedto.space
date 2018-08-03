<template>
  <div class="rocket" :class="{ flip: showBack }">
    <div class="flipper">
      <v-card class="front">
        <v-card-title class="title center">
          {{ rocket.name }}
          <v-icon @click="showBack = true">info</v-icon>
        </v-card-title>

        <v-card-text>
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
        </v-card-text>

        <v-card-title class="title center">
          {{ rocket.stages.length }} Stages
        </v-card-title>

        <v-card-text v-if="rocket.stages.length > 0" class="stages">
          <div v-for="(stage, index) in rocket.stages" :key="`stage-${index}`" class="stage">
            <h5>{{index + 1}}) {{ stage.name }}</h5>
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
              <tr v-if="stage.propellants">
                <th>Propellants:</th>
                <td>{{ stage.propellants }}</td>
              </tr>
            </table>
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
          </div>
        </v-card-text>
      </v-card>

      <v-card class="back">
        <v-card-title class="title center">
          {{ rocket.name }}
          <v-icon @click="showBack = false">close</v-icon>
        </v-card-title>

        <v-card-text>
          <h5>Launches:</h5>
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
import { filter } from 'lodash';

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
    launches () { return filter(this.$store.state.launches, { vehicle: this.rocket.name }); }
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

.rocket
  position relative
  margin-top 1rem
  margin 0 0 1.5rem left-padding
  perspective 1000px

  &.flip .flipper
    transform rotateY(180deg)

  .flipper
    transition 0.6s
    transform-style preserve-3d
    position relative

  .v-card
    font-size 1rem
    max-height 740px
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

    .v-card__title
      display block

      > div
        width 100%

      .v-icon
        position absolute
        right 0.5rem
    
    .v-card__text
      padding 8px 16px 8px 16px

      &.hero
        padding 0

        > img
          width 100%
          cursor pointer

    h5, th
      text-align left
      font-size 0.9rem
      font-weight 500
      padding-right 1rem

    td
      font-size 0.8rem
      padding-right 0.1em

    .launches 
      margin-left 0.5rem
      height 500px
      overflow-y auto

      td, th
        padding 0 0.5rem

    .stages
      max-height 425px
      column-count 2
      overflow-y auto

      .stage
        break-inside avoid-column

        table
          padding-left 1rem
          padding-bottom 1rem

          &.engines th:nth-of-type(1)
          &.engines td:nth-of-type(1)
            width 45%
          &.engines th:nth-of-type(2)
          &.engines td:nth-of-type(2)
            width 5%
          &.engines th:nth-of-type(3)
          &.engines td:nth-of-type(3)
            width 50%
</style>
