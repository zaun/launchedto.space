<template>
  <div id="rocketFamily">
    <v-navigation-drawer app permanent fixed light width=200 class="ml-0 pl-0 pb-0 mb-0">
      <v-list two-line dense>
        <v-list-group v-for="(family, idx) in items" :key="`family-${idx}`">
          <v-list-tile slot="activator">
            <v-list-tile-avatar>
              <v-btn block fab outline color="pink" @click="showAddFamily">
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
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
      <v-footer app fixed height="50">
        <v-btn block round outline small color="pink" @click="showAddFamily">
          <v-icon>add</v-icon>
        </v-btn>
      </v-footer>
    </v-navigation-drawer>

    <v-form ref="rocketForm" v-model="rocketFormValid" lazy-validation>
      <v-layout row>
        <v-flex xs4>
          <v-text-field disabled v-model="selectedGroup.name" label="Rocket Family" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-text-field v-model="selected.name" label="Rocket Name" required :rules="requiredRule" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-text-field v-model="selected.height" label="Rocket Height (m)" class="pr-1"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs4>
          <v-text-field v-model="selected.wikipediaURL" label="Wikipedia URL" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-text-field v-model="selected.astronautixURL" label="Astronautix URL" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-text-field v-model="selected.skyrocketURL" label="Skyrocket URL" class="pr-1"></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
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
          <div class="bottom">
            <div row v-if="selected && selected.payloads" v-for="(payload, idx) in selected.payloads" :class="{'odd': idx % 2 !== 0}" :key="`payload-${idx}`">
              <v-layout row>
                <v-flex xs5>
                  <v-select v-model="payload.orbit" :items="orbitOptions" label="Orbital" class="pr-1"></v-select>
                </v-flex>
                <v-flex xs5>
                  <v-text-field v-model="payload.capacity" label="Capacity (kg)" required :rules="requiredRule"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-btn id="payloadDelete" icon outline @click="deletePayload(idx)">
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
          <div class="bottom">
            <div row v-if="selected && selected.stages" v-for="(stage, idx) in selected.stages" :class="{'odd': idx % 2 !== 0}" :key="`stage-${idx}`">
              <v-layout row>
                <v-flex xs2>
                  <v-text-field v-model="stage.name" label="Name" required :rules="requiredRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.emptyMass" label="Empty Mass (kg)" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.grossMass" label="Gross Mass (kg)" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs1>
                  <v-text-field v-model="stage.height" label="Height (m)" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.diameter" label="Diameter (m)" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.span" label="Span (m)" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs1>
                  <v-btn id="rocketDelete" icon outline @click="deleteStage(idx)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs2></v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.burnTime" label="Burn Time (s)" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.seaLevelIsp" label="Sea Level ISP" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs1>
                  <v-text-field v-model="stage.isp" label="ISP" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.thrustVac" label="Thrust Vac (kN)" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-text-field v-model="stage.propellants" label="Propellants" class="pr-1"></v-text-field>
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
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash';
  import uuidv4 from 'uuid/v4';

  export default {
    name: 'rockets',

    components: { },

    data() {
      return {
        familyFormValid: true,
        rocketFormValid: true,

        requiredRule: [v => !!v || 'Item is required'],

        addFamilyDialog: false,
        newFamilyName: '',

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
    },

    methods: {
      addPayload() {
        this.selected.payloads.push({});
      },

      addStage() {
        this.selected.stages.push({});
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
          });
          this.addFamilyDialog = false;
        }
      },

      saveRocket() {
        if (this.$refs.rocketForm.validate()) {
          this.$store.dispatch('saveRocket', this.selected);
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
    },
  };
</script>

<style scoped>
  #rocketFamily {
    position: relative;
    height: 100%;
    width: 100%;
  }

  #payloadAdd,
  #stageAdd {
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
    top: 190px;
    bottom: 45px;
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
