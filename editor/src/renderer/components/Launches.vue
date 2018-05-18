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
      <v-layout class="section" row>
        <v-flex xs11>
          <h3 class="headline">Payloads ({{selected.payloads ? selected.payloads.length : 0 }})</h3>
        </v-flex>
        <v-flex xs1>
          <v-btn id="payloadAdd" fixed right fab outline small color="pink" @click="addPayload">
            <v-icon>add</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <div class="payloads">
        <v-layout row v-if="selected && selected.payloads" v-for="(payload, idx) in selected.payloads" :key="`payload-${idx}`">
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
      </div>
      <v-footer class="launchFooter" app height="43">
        <v-spacer></v-spacer>
        <v-btn :disabled="!launchFormValid" round outline small color="pink" @click="saveLaunch">
          Save Launch
        </v-btn>
      </v-footer>
    </v-form>
  </div>
</template>

<script>
  import { cloneDeep, find, findIndex, map, sortBy } from 'lodash';
  import uuidv4 from 'uuid/v4';

  export default {
    name: 'launches',

    components: { },

    data() {
      return {
        launchFormValid: true,
        requiredRule: [v => !!v || 'Item is required'],
        requiredDate: [
          v => !!v || 'Item is required',
          v => /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(v) || 'Date must be valid YYYY-MM-DD',
        ],

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

      deletePayload(item) {
        if (!this.selected) {
          return;
        }

        const idx = findIndex(this.selected.payloads, item);
        this.$delete(this.selected.payloads, idx);
      },

      saveLaunch() {
        if (this.$refs.launchForm.validate()) {
          this.$store.dispatch('saveLaunch', this.selected);
        }
      },

      select(item) {
        this.selected = cloneDeep(item);
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

  .payloads {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 190px;
    bottom: 56px;
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
</style>
