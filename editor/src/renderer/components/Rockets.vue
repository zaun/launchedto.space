<template>
  <div id="rocketFamily">
    <v-navigation-drawer app permanent fixed light width="200" class="ml-0 pl-0 pb-0 mb-0">
      <v-list two-line dense>
        <v-list-group v-for="(family, idx) in items" :key="`family-${idx}`">
          <v-list-tile slot="activator">
            <v-list-tile-avatar>
              <v-btn block fab outline color="pink" @click="addRocket(family)">
                <v-icon>add</v-icon>
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ family.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="(rocket, idx) in family.rockets" :class="{ blue: rocket.id === selected.id }" :key="`rocket-${idx}`" @click="select(family, rocket)">
            <v-list-tile-content class="pl-4">
              <v-list-tile-title>{{ rocket.name }}</v-list-tile-title>
              <v-list-tile-sub-title>Launches: {{ getLaunchCount(rocket) }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
      <v-footer app fixed height="50">
        <v-btn block round outline small color="pink" @click.prevent="showAddFamily">
          <v-icon>add</v-icon>
        </v-btn>
      </v-footer>
    </v-navigation-drawer>

    <v-form ref="rocketForm" v-model="rocketFormValid" lazy-validation>
      <v-layout row>
        <v-flex xs2>
          <v-text-field disabled v-model="selectedGroup.name" label="Rocket Family" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.name" label="Rocket Name" required :rules="requiredRule" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.height" label="Total Height (m)" type="number" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.diameter" label="Diameter (m)" type="number" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs1>
          <v-text-field v-model="selected.span" label="Span (m)" type="number" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs1>
          <v-select v-model="selected.expendable" :items="expendableOptions" label="Expendable" class="pr-1"></v-select>
        </v-flex>
        <v-flex xs2>
          <v-select v-model="selected.payloadType" :items="payloadTypeOptions" label="Payload Type" clearable class="pr-1"></v-select>
        </v-flex>
        <v-flex v-if="selected.payloadType == 'Fairing'" xs2>
          <v-text-field v-model="selected.fairingHeight" label="Fairing Height (m)" type="number" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex v-if="selected.payloadType == 'Fairing'" xs2>
          <v-text-field v-model="selected.fairingDiameter" label="Fairing Diameter (m)" type="number" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex v-if="selected.payloadType == 'Capsule'" xs2>
          <v-text-field v-model="selected.capsuleHeight" label="Capsule Height (m)" type="number" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex v-if="selected.payloadType == 'Capsule'" xs2>
          <v-text-field v-model="selected.capsuleDiameter" label="Capsule Diameter (m)" type="number" class="pr-1"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs2>
          <v-text-field v-model="selected.wikipediaURL" label="Wikipedia URL" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.astronautixURL" label="Astronautix URL" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.skyrocketURL" label="Skyrocket URL" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.spacelaunchreportURL" label="Space Launch Report URL" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.spaceflight101URL" label="Spaceflight 101 URL" class="pr-1"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs2>
          <v-btn outline color="pink" @click="showAddRocketImage()">
            Set<br />Image
          </v-btn>
        </v-flex>
        <v-flex xs10>
          <div class="rocket-image" :style="{ 'height': getRocketImageHeight() }">
            <div class="image" :style="{ 'background-image': 'url(' + imageData[selected.id] + ')', 'width': getRocketImageWidth() }"></div>
            <div class="scale" :style="{ width: `${metersToPixels(100)}px` }">100 (m)</div>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs2>
          <v-btn outline color="pink" @click="showAddRocketIcon()">
            Set<br />Icon
          </v-btn>
        </v-flex>
        <v-flex xs10>
          <div class="rocket-icon">
            <div class="image" :style="{ 'background-image': 'url(' + imageData[`${selected.id}-icon`] + ')' }"></div>
          </div>
        </v-flex>
      </v-layout>

      <v-layout row class="bottom" :style="{ top: getBottomHeight() }">
        <v-flex xs3 class="pr-1">
          <v-layout row class="section">
            <v-flex xs10>
              <h3 class="headline">Payloads ({{selected.payloads ? selected.payloads.length : 0 }})</h3>
            </v-flex>
            <v-flex xs2>
              <v-btn id="payloadAdd" fab outline small color="pink" @click="addPayload">
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <div class="bottomInner">
            <div row v-if="selected && selected.payloads" v-for="(payload, idx) in selected.payloads" :class="{'odd': idx % 2 !== 0}" :key="`payload-${idx}`">
              <v-layout row>
                <v-flex xs5>
                  <v-select v-model="payload.orbit" :items="orbitOptions" label="Orbital" class="pr-1"></v-select>
                </v-flex>
                <v-flex xs5>
                  <v-text-field v-model="payload.capacity" label="Capacity (kg)" type="number" required :rules="requiredNumberRule"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-btn id="payloadDelete" icon small outline @click="deletePayload(idx)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </v-flex><!-- Payloads -->

        <v-flex xs9>
          <v-layout row class="section">
            <v-flex xs11>
              <h3 class="headline">Stages ({{selected.stages ? selected.stages.length : 0 }})</h3>
            </v-flex>
            <v-flex xs1>
              <v-btn id="stageAdd" fab outline small color="pink" @click="addStage">
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <div class="bottomInner">
            <div row v-if="selected && selected.stages" v-for="(stage, idx) in selected.stages" :class="{'odd': idx % 2 !== 0}" :key="`stage-${idx}`">
              <v-layout row>
                <v-flex xs2>
                  <v-text-field v-model="stage.name" label="Name" required :rules="requiredRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.emptyMass" label="Empty Mass (kg)" type="number" :rules="numberRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.grossMass" label="Gross Mass (kg)" type="number" :rules="numberRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs1>
                  <v-text-field v-model="stage.height" label="Height (m)" type="number" :rules="numberRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.diameter" label="Diameter (m)" type="number" :rules="numberRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.span" label="Span (m)" type="number" :rules="numberRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs1>
                  <v-btn id="rocketDelete" icon small outline @click="deleteStage(idx)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex v-if="!stage.engines || (stage.engines && stage.engines.length == 0)" xs2>
                  <v-btn id="engineAdd" fab outline small color="pink" @click="addEngine(stage)">
                    <v-icon>add</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex v-if="stage.engines && stage.engines.length != 0" xs2></v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.burnTime" label="Burn Time (s)" type="number" :rules="numberRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.seaLevelIsp" label="Sea Level ISP" type="number" :rules="numberRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs1>
                  <v-text-field v-model="stage.isp" label="ISP" type="number" :rules="numberRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.thrustVac" label="Thrust Vac (kN)" type="number" :rules="numberRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.propellants" label="Propellants" class="pr-1"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout v-for="(engine, eidx) in stage.engines" :key="`engine-${eidx}`" row>
                <v-flex v-if="eidx == 0" xs2>
                  <v-btn id="engineAdd" fab outline small color="pink" @click="addEngine(stage)">
                    <v-icon>add</v-icon>
                  </v-btn>
                  <v-btn id="engineAdd" fab outline small color="pink" @click="deleteEngine(stage, eidx)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex v-if="eidx != 0" xs2>
                  <v-btn id="engineDelete" fab outline small color="pink" @click="deleteEngine(stage, eidx)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="engine.name" label="Engine" required :rules="requiredRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs1>
                  <v-text-field v-model="engine.count" label="Count" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs3>
                  <v-text-field v-model="engine.thrustVac" label="Thrust Vac (kN)" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs3>
                  <v-text-field :value="engine.count * engine.thrustVac" label="Total Thrust Vac (kN)" class="pr-1" disabled></v-text-field>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </v-flex><!-- Stages -->
      </v-layout>

      <v-footer class="rocketFooter" app height="43">
        <v-spacer></v-spacer>
        <v-btn round outline small color="pink" @click="saveRocket">
          Save Rocket
        </v-btn>
      </v-footer>
    </v-form>

    <v-dialog v-model="addFamilyDialog" max-width="500px">
      <v-form ref="familyForm" v-model="familyFormValid" lazy-validation>
        <v-card>
          <v-card-title>
            <span>New Rocket Family</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="newFamilyName" label="Rocket Family Name" required :rules="requiredRule" class="pr-1"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!familyFormValid" color="primary" flat @click.stop="doAddFamily">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="rocketImageDialog" max-width="500px">
      <v-form ref="imageForm" v-model="imageFormValid" lazy-validation>
        <v-card>
          <v-card-title>
            <span>{{ rocketImageDialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <file-input v-model="rocketImageFilename" label="Select Rocket Image..." />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!imageFormValid" color="primary" flat @click.stop="doAddRocketImage">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { copySync } from 'fs-extra';
import { cloneDeep, filter } from 'lodash';
import path from 'path';
import uuidv4 from 'uuid/v4';

import fileInput from './file-input.vue';

const PIXELS_PER_METER = 10;

export default {
  name: 'rockets',

  components: {
    fileInput,
  },

  data() {
    return {
      familyFormValid: true,
      rocketFormValid: true,
      imageFormValid: true,

      requiredRule: [(v) => !!v || 'Item is required'],
      numberRule: [
        (v) => {
          if (v) {
            return /^(\s*|\d+(\.\d{1,4})?)$/.test(v) || 'Float; max precision 4';
          }
          return true;
        },
      ],
      requiredNumberRule: [
        (v) => !!v || 'Item is required',
        (v) => /^\d+(\.\d{1,4})?$/.test(v) || 'Float; max precision 4',
      ],

      addFamilyDialog: false,
      newFamilyName: '',

      rocketImageDialogMode: 0,
      rocketImageDialogTitle: '',
      rocketImageDialog: false,
      rocketImageFilename: '',

      payloadTypeOptions: [
        'Capsule',
        'Fairing',
        'None',
      ],
      expendableOptions: [
        { value: 'yes', text: 'Yes' },
        { value: 'no', text: 'No' },
        { value: '', text: 'Unknown' },
      ],

      selectedGroup: {},
      selected: {},
    };
  },

  computed: {
    items() {
      return this.$store.state.families;
    },
    orbitOptions() {
      return this.$store.state.orbitOptions;
    },
    imageData() {
      return this.$store.state.imageData;
    },
  },

  methods: {
    addEngine(stage) {
      stage.engines.push({});
      this.$set(stage.engines, stage.engines);
      // eslint-disable-next-line
        console.log(stage);
    },

    addPayload() {
      this.selected.payloads.push({});
      this.$set(this.selected.payloads, this.selected.payloads);
    },

    addRocket(group) {
      this.selectedGroup = group;
      this.selected = {
        id: uuidv4(),
        engines: [],
        payloads: [],
        stages: [],
      };
    },

    addStage() {
      this.selected.stages.push({
        engines: [],
      });
      this.$set(this.selected.stages, this.selected.stages);
    },

    deleteEngine(stage, idx) {
      this.$delete(stage.engines, idx);
    },

    deletePayload(idx) {
      this.$delete(this.selected.payloads, idx);
    },

    deleteStage(idx) {
      this.$delete(this.selected.stages, idx);
    },

    doAddFamily() {
      if (this.$refs.familyForm.validate()) {
        this.$store.dispatch('addRocketFamily', {
          id: uuidv4(),
          name: this.newFamilyName,
          rockets: [],
        });
        this.addFamilyDialog = false;
      }
    },

    doAddRocketImage() {
      if (this.rocketImageFilename) {
        const name = path.basename(this.rocketImageFilename);
        if (this.rocketImageDialogMode === 0) {
          copySync(this.rocketImageFilename, path.join(__dirname, '../../../../media/vehicles/', name));
          this.selected.rocketImage = name;
          this.$store.dispatch('addRocketImage', {
            id: this.selected.id,
            name,
          });
        } else {
          copySync(this.rocketImageFilename, path.join(__dirname, '../../../../media/vehicles_icon/', name));
          this.selected.rocketIcon = name;
          this.$store.dispatch('addRocketIcon', {
            id: this.selected.id,
            name,
          });
        }
      }

      this.rocketImageDialog = false;
    },

    getRocketImageWidth() {
      let width = 100;
      if (this.selected.height) {
        width = ((this.selected.height / 100) * (PIXELS_PER_METER * 100));
      }
      return `${width}px`;
    },

    getRocketImageHeight() {
      let height = 40;
      if (this.selected.span) {
        height = ((this.selected.span / 100) * (PIXELS_PER_METER * 100));
      } else if (this.selected.diameter) {
        height = ((this.selected.diameter / 100) * (PIXELS_PER_METER * 100));
      }
      return `${height}px`;
    },

    getBottomHeight() {
      let height = 0;
      if (this.selected.span) {
        height = ((this.selected.span / 100) * (PIXELS_PER_METER * 100));
      } else if (this.selected.diameter) {
        height = ((this.selected.diameter / 100) * (PIXELS_PER_METER * 100));
      }
      height += 163;
      height += 75; // Icon image
      height += 5; // Padding

      if (height < 200) {
        height = 200;
      }
      return `${height}px`;
    },

    getLaunchCount(rocket) {
      return filter(this.$store.state.launches, { vehicle: rocket.name }).length;
    },

    metersToPixels(meters) {
      return (PIXELS_PER_METER * meters);
    },

    saveRocket() {
      if (this.$refs.rocketForm.validate()) {
        this.$store.dispatch('saveRocket', {
          family: this.selectedGroup.name,
          rocket: this.selected,
        });
      }
    },

    select(group, item) {
      this.selectedGroup = group;
      this.selected = cloneDeep(item);
    },

    showAddFamily() {
      this.familyFormValid = true;
      this.$refs.familyForm.reset();
      this.newFamilyName = '';
      this.addFamilyDialog = true;
    },

    showAddRocketImage() {
      this.rocketImageDialogMode = 0;
      this.rocketImageDialogTitle = 'Select Rocket Image';
      this.rocketImageFilename = '';
      this.rocketImageDialog = true;
    },

    showAddRocketIcon() {
      this.rocketImageDialogMode = 1;
      this.rocketImageDialogTitle = 'Select Rocket Icon';
      this.rocketImageFilename = '';
      this.rocketImageDialog = true;
    },
  },
};
</script>

<style scoped>
  #rocketFamily {
    position: relative;
    height: 100%;
    width: 100%;
  }

  #rocketFamily form {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50px;
    overflow: hidden;
  }

  #payloadAdd,
  #stageAdd,
  #engineAdd,
  #engineDelete {
    width: 20px;
    height: 20px;
    margin-top: 6px;
  }

  #rocketDelete {
  }

  .section {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #000;
    background-color: #eee;
  }

  .rocket-image {
    position: relative;
    width: 900px;
  }

  .rocket-image .image {
    background-size: contain;
    background-position: 50%;
    height: 100%;
    background-color: #eee;
  }

  .rocket-image .scale {
    position: absolute;
    top: -3px;
    height: 0px;
    border-bottom: 1px solid Black;
  }

  .rocket-icon {
    position: relative;
    width: 75px;
    height: 75px;
    border: 1px solid #ccc;
  }

  .rocket-icon .image {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: contain;
    background-position: 50%;
  }

  .payloads {
    position: relative;
    float: left;
    overflow-y: auto;
    width: 35%
  }

  .stages {
    position: relative;
    float: left;
    overflow-y: auto;
    margin-left: 36%;
    width: 64%
  }

  .rocketFooter {
    height: 50px;
    left: 200px;
    width: auto;
    right: 0px;
  }

  .odd {
    background-color: #eee;
  }

  .bottom {
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0;
  }

  .bottomInner {
    position: relative;
    top: 0;
    height: calc(100% - 33px);
    overflow-y: auto;
  }

  .navigation-drawer.navigation-drawer--fixed {
    top: 56px;
    height: calc(100% - 50px) !important;
    z-index: 2;
  }

  .navigation-drawer .list {
    height: calc(100% - 50px) !important;
    overflow-y: auto;
  }

  .navigation-drawer .footer.footer--fixed {
    width: auto;
    right: 1px
  }

  .navigation-drawer .footer .btn {
    position: absolute;
    max-width: 50%;
    max-height: 75%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0px;
    margin: 0px;
  }

  .avatar {
    position: relative;
    width: 20px !important;
    height: 20px !important;
  }

  .avatar .btn {
    position: relative;
    width: 100% !important;
    height: 100% !important;
  }

  .avatar .btn .icon {
    font-size: 14px;
  }
</style>
