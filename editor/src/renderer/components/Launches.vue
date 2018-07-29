<template>
  <div id="rockets">
    <v-navigation-drawer app permanent fixed light width=200 class="ml-0 pl-0 pb-0 mb-0">
      <v-list two-line dense>
        <v-list-tile v-for="(item, idx) in items" :class="{ blue: item.id === selected.id }" :key="`launch-${idx}`" @click="select(item)">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.vehicle }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ item.date }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-footer app fixed height="50">
        <v-btn block round outline small color="pink" @click="addLaunch">
          <v-icon>add</v-icon>
        </v-btn>
      </v-footer>
    </v-navigation-drawer>

    <v-form ref="launchForm" v-model="launchFormValid">
      <v-layout row>
        <v-flex xs3>
          <v-select v-model="selected.vehicleFamily" :items="vehicleFamilyOptions" label="Vehicle Family" @change="selected.vehicle=''" required :rules="requiredRule" class="pr-1"></v-select>
        </v-flex>
        <v-flex xs3>
          <v-select v-model="selected.vehicle" :items="vehicleOptions" label="Vehicle" required :rules="requiredRule" class="pr-1"></v-select>
        </v-flex>
        <v-flex xs3>
          <v-text-field v-model="selected.serial" label="Serial Number" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-select v-model="selected.manned" :items="mannedOptions" label="Manned Flight" class="pr-1"></v-select>
        </v-flex>
        <v-flex xs3>
          <v-select v-model="selected.orbital" :items="orbitalOptions" label="Orbital"></v-select>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs3>
          <v-text-field v-model="selected.date" label="Launch Date" required :rules="requiredDate" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-select v-model="selected.status" :items="statusOptions" label="Status" class="pr-1"></v-select>
        </v-flex>
        <v-flex xs3>
          <v-select v-model="selected.launchSite" :items="launchSiteOptions" label="Launch Site" class="pr-1"></v-select>
        </v-flex>
        <v-flex xs3>
          <v-text-field v-model="selected.launchPad" label="Launch Pad"></v-text-field>
        </v-flex>
      </v-layout>


      <v-layout row class="bottom">
        <v-flex xs2 class="pr-1 mediaSection">
          <v-layout row class="section">
            <v-flex xs10>
              <h3 class="headline">Media ({{media ? media.length : 0 }})</h3>
            </v-flex>
            <v-flex xs2>
              <v-btn id="mediaAdd" fab outline small color="pink" @click="addMedia">
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <div class="bottomInner">
            <div row v-if="media" v-for="(mediaItem, idx) in media" :class="{'odd': idx % 2 !== 0}" :key="`media-${idx}`">
              <v-layout row>
                <v-flex xs10>
                  <img :src="imageData[mediaItem.id]" />
                </v-flex>
                <v-flex xs2>
                  <v-btn id="mediaDelete" icon small outline @click="deleteMedia(mediaItem)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                  <v-btn id="mediaDefault" icon small outline @click="defaultMedia(mediaItem)" :style="defaultMediaStyle(mediaItem)">
                    <v-icon>check</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field v-model="mediaItem.description" :multi-line="true" auto-grow rows="5" row-height="10" label="Description" counter="800" class="description"></v-text-field>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </v-flex><!-- Media -->

        <v-flex xs10>
          <v-layout row class="section">
          <v-flex xs11>
            <h3 class="headline">Payloads ({{selected.payloads ? selected.payloads.length : 0 }})</h3>
          </v-flex>
          <v-flex xs1>
            <v-btn id="payloadAdd" fab outline small color="pink" @click="addPayload">
              <v-icon>add</v-icon>
            </v-btn>
          </v-flex>
          </v-layout>
          <div class="bottomInner">
            <div v-if="selected && selected.payloads" v-for="(payload, idx) in selected.payloads" :key="`payload-${idx}`">
              <v-layout row>
                <v-flex xs3>
                  <v-text-field v-model="payload.name" label="Name" required :rules="requiredRule" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-select v-model="payload.orbital" :items="orbitalOptions" label="Orbital" class="pr-1"></v-select>
                </v-flex>
                <v-flex xs1>
                  <v-select v-model="payload.orbit" :items="orbitOptions" label="Orbit" class="pr-1"></v-select>
                </v-flex>
                <v-flex xs1>
                  <v-text-field v-model="payload.mass" label="Mass (kg)" class="pr-1"></v-text-field>
                </v-flex>
                <v-flex xs2>
                  <v-select v-model="payload.type" :items="payloadOptions" label="Type" class="pr-1"></v-select>
                </v-flex>
                <v-flex xs2>
                  <v-select v-model="payload.status" :items="statusOptions" label="Status" class="pr-1"></v-select>
                </v-flex>
                <v-flex xs1>
                  <v-btn id="payloadDelete" icon outline @click="deletePayload(payload)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs1></v-flex>
                <v-flex xs10>
                  <v-text-field v-model="payload.description" :multi-line="true" rows="2" row-height="10" label="Description" counter="300" :rules="descriptionRule" class="description pr-1"></v-text-field>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </v-flex><!-- Payloads -->
      </v-layout>

      <v-footer class="launchFooter" app height="43">
        <v-spacer></v-spacer>
        <v-btn :disabled="!launchFormValid" round outline small color="pink" @click="saveLaunch">
          Save Launch
        </v-btn>
      </v-footer>
    </v-form>

    <v-dialog v-model="launchMediaDialog" max-width="500px">
      <v-form ref="imageForm" v-model="imageFormValid" lazy-validation>
        <v-card>
          <v-card-title>
            <span>Select Launch Image</span>
          </v-card-title>
          <v-card-text>
            <v-select v-model="launchMediaType" :items="mediaOptions" label="Image From"></v-select>
            <file-input v-model="launchMediaFilename" label="Select Image..." />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!imageFormValid" color="primary" flat @click.stop="doAddMedia">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
  import { copySync } from 'fs-extra';
  import { cloneDeep, filter, find, findIndex, map, sortBy } from 'lodash';
  import path from 'path';
  import sharp from 'sharp';
  import uuidv4 from 'uuid/v4';

  import fileInput from './file-input.vue';

  export default {
    name: 'launches',

    components: {
      fileInput,
    },

    data() {
      return {
        imageFormValid: true,
        launchFormValid: true,
        requiredRule: [v => !!v || 'Item is required'],
        requiredDate: [
          v => !!v || 'Item is required',
          v => /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(v) || 'Date must be valid YYYY-MM-DD',
        ],
        descriptionRule: [
          v => v.length < 300 || 'Item is to long',
        ],

        launchMediaDialog: false,
        launchMediaType: '',
        launchMediaFilename: '',

        launchSiteOptions: [
          'Cape Canaveral',
          'Kennedy Space Center',
          'Omelek Island',
          'SpaceX McGregor Test Site',
          'Vandenberg AFB',
          'Unknown',
        ],
        statusOptions: [
          { value: 'success', text: 'Success' },
          { value: 'partial failure', text: 'Partial Failure' },
          { value: 'failure', text: 'Failure' },
          { value: '', text: 'Unknown' },
        ],
        mannedOptions: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
          { value: '', text: 'Unknown' },
        ],
        orbitalOptions: [
          { value: 'yes', text: 'Yes' },
          { value: 'no', text: 'No' },
          { value: '', text: 'Unknown' },
        ],
        payloadOptions: [
          'Capsule',
          'Satellite',
          'Station',
        ],
        mediaOptions: [
          { value: '', text: 'Random Image' },
          { value: 'nasa', text: 'Nasa' },
          { value: 'spacex', text: 'SpaceX' },
        ],
        media: [],
        selected: {},
      };
    },

    computed: {
      vehicleFamilyOptions() {
        return map(this.$store.state.families, i => i.name);
      },
      vehicleOptions() {
        const fam = find(this.$store.state.families, { name: this.selected.vehicleFamily });
        if (!fam) {
          return [];
        }
        return map(sortBy(fam.rockets, 'name'), r => r.name);
      },
      items() {
        return this.$store.state.launches;
      },
      orbitOptions() {
        return this.$store.state.orbitOptions;
      },
      imageData() {
        return this.$store.state.imageData;
      },
    },

    methods: {
      addLaunch() {
        this.selected = {
          id: uuidv4(),
          manned: 'no',
          orbital: 'no',
          status: '',
          payloads: [],
        };
      },

      addMedia() {
        this.launchMediaDialog = true;
      },

      addPayload() {
        if (!this.selected) {
          return;
        }

        this.selected.payloads.push({
          id: uuidv4(),
          name: '',
          orbital: this.selected.orbital ? this.selected.orbital : '',
          orbit: 'LEO',
          mass: -1,
          type: 'Satellite',
          status: this.selected.status,
          description: '',
        });
      },

      defaultMediaStyle(item) {
        return {
          opacity: item.default === true ? 1 : 0.25,
        };
      },

      defaultMedia(item) {
        if (!this.selected) {
          return;
        }

        this.media.forEach((m, idx) => {
          if (m.id === item.id) {
            m.default = true;
            this.$set(this.media, idx, m);
            this.$store.dispatch('defaultLaunchMedia', m);
          } else if (m.default === true) {
            m.default = false;
            this.$set(this.media, idx, m);
            this.$store.dispatch('defaultLaunchMedia', m);
          }
        });
      },

      deleteMedia(item) {
        if (!this.selected) {
          return;
        }

        const idx = findIndex(this.media, item);
        this.$delete(this.media, idx);

        this.$store.dispatch('deleteLaunchMedia', item);
      },

      deletePayload(item) {
        if (!this.selected) {
          return;
        }

        const idx = findIndex(this.selected.payloads, item);
        this.$delete(this.selected.payloads, idx);
      },

      doAddMedia() {
        if (this.launchMediaFilename) {
          const mediaID = uuidv4();
          let name = path.basename(this.launchMediaFilename);
          if (this.launchMediaType) {
            name = path.join(this.launchMediaType, name);
          }
          const origFile = path.join(__dirname, '../../../../media/orig/', name);
          const thumbFile = path.join(__dirname, '../../../../media/thumb/', name);
          copySync(this.launchMediaFilename, origFile);
          sharp(origFile).resize(500).toFile(thumbFile).then(() => {
            this.$store.dispatch('addLaunchMedia', {
              id: mediaID,
              launchID: this.selected.id,
              description: '',
              filename: name,
            });

            this.media.push({
              id: mediaID,
              launchID: this.selected.id,
              description: '',
              filename: name,
            });
          });
        }

        this.launchMediaType = '';
        this.launchMediaDialog = false;
      },

      saveLaunch() {
        if (this.$refs.launchForm.validate()) {
          this.$store.dispatch('saveLaunch', this.selected);
          this.$store.dispatch('saveMedia', this.media);
        }
      },

      select(item) {
        this.selected = cloneDeep(item);
        this.media = cloneDeep(filter(this.$store.state.media, { launchID: this.selected.id }));
      },
    },

    created() {
      if (this.items.length > 0) {
        this.select(this.items[0]);
      } else {
        this.addLaunch();
      }
    },
  };
</script>

<style scoped>
  #rockets {
    position: relative;
    height: 100%;
    width: 100%;
  }

  #mediaAdd,
  #payloadAdd {
    width: 20px;
    height: 20px;
    margin-top: 6px;
  }

  #payloadDelete {
  }

  .section {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #000;
    background-color: #eee;
  }


  .bottom {
    position: absolute;
    top: 150px;
    bottom: 0px;
    left: 0;
    right: 0;
  }

  .bottomInner {
    position: relative;
    top: 0;
    padding-right: 8px;
    height: calc(100% - 73px);
    overflow-y: auto;
  }

  .launchFooter {
    height: 50px;
    left: 200px;
    width: auto;
    right: 0px;
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

  img {
    width: 100%;
  }

  .mediaSection {
    min-width: 20em;
  }
</style>
