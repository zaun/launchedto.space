<template>
  <div id="rockets">
    <v-navigation-drawer app permanent fixed light width=200 class="ml-0 pl-0 pb-0 mb-0">
      <v-list two-line dense>
        <v-list-tile v-for="(item, idx) in items" :class="{ blue: item.id === selected.id }" :key="`astronaut-${idx}`" @click="select(item)">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.lastName + ', ' + item.firstName }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ item.nationality }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-footer app fixed height="50">
        <v-btn block round outline small color="pink" @click="addAstronaut">
          <v-icon>add</v-icon>
        </v-btn>
      </v-footer>
    </v-navigation-drawer>

    <v-form ref="dataForm" v-model="formIsValid">
      <v-layout row>
        <v-flex xs2>
          <v-text-field v-model="selected.firstName" label="First Name" required :rules="requiredRule" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.middleName" label="Middle Name" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.lastName" label="Last Name" required :rules="requiredRule" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-select v-model="selected.suffix" :items="suffixOptions" label="Suffix" clearable class="pr-1"></v-select>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.nickName" label="Nickname" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-select v-model="selected.gender" :items="genderOptions" label="Gender" clearable class="pr-1"></v-select>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs2>
          <v-select v-model="selected.nationality" :items="nationalityOptions" label="Nationality" clearable required :rules="requiredRule" class="pr-1"></v-select>
        </v-flex>
        <v-flex xs1>
          <v-text-field v-model="selected.birthDate" label="Birth Date" :rules="dateRule" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.birthCity" label="Birth City" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.birthReagon" label="Birth Province / State" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs1>
          <v-text-field v-model="selected.deathDate" label="Death Date" :rules="dateRule" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.deathCity" label="Death City" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.deathReagon" label="Death Province / State" class="pr-1"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-divider></v-divider>
      </v-layout>
      <v-layout row>
        <v-flex xs3>
          <v-select v-model="selected.military" :items="militaryOptions" label="Military" clearable class="pr-1"></v-select>
        </v-flex>
        <v-flex xs2>
          <v-select v-model="selected.militaryRank" :items="militaryRankOptions" label="Rank" clearable class="pr-1"></v-select>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.militaryYears" label="Years of Service" :rules="numberRule" class="pr-1"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-divider></v-divider>
      </v-layout>
      <v-layout row>
        <v-flex xs2>
          <v-select v-model="selected.status" :items="statusOptions" label="Status" required :rules="requiredRule" class="pr-1"></v-select>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.daysInSpace" label="Days In Space (d)" :rules="numberRule" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="selected.evaTime" label="EVA Time (h)" :rules="numberRule" class="pr-1"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-divider></v-divider>
      </v-layout>
      <v-layout row>
        <h3 class="headline">Almamaters ({{selected.almamaters.length }})</h3>
        <v-btn id="almamaterAdd" icon outline @click="addAlmamater()">
          <v-icon>add</v-icon>
        </v-btn>
      </v-layout>
      <v-layout v-for="(school, idx) in selected.almamaters" :key="`school-${idx}`" row>
        <v-flex xs4>
          <v-text-field v-model="school.name" label="Almamater Name" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="school.year" label="Graduation Year" :rules="yearRule" class="pr-1"></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-select v-model="school.degree" :items="degreeOptions" label="Degree" clearable class="pr-1"></v-select>
        </v-flex>
        <v-flex xs3>
          <v-text-field v-model="school.fieldOfStudy" label="Field of Study" class="pr-1"></v-text-field>
        </v-flex>
      </v-layout>

       <v-footer class="formFooter" app height="43">
         <v-spacer></v-spacer>
         <v-btn :disabled="!formIsValid" round outline small color="pink" @click="saveAstronaut">
           Save Astronaut
         </v-btn>
       </v-footer>
     </v-form>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash';
  import uuidv4 from 'uuid/v4';

  import fileInput from './file-input.vue';

  export default {
    name: 'launches',

    components: {
      fileInput,
    },

    data() {
      return {
        formIsValid: true,
        requiredRule: [v => !!v || 'Item is required'],
        dateRule: [
          (v) => {
            if (v) {
              return /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(v) || 'Date must be valid YYYY-MM-DD';
            }
            return true;
          },
        ],
        numberRule: [
          (v) => {
            if (v) {
              return /^(\s*|\d+(\.\d{1,4})?)$/.test(v) || 'Float; max precision 4';
            }
            return true;
          },
        ],
        yearRule: [
          (v) => {
            if (v) {
              return /^(\d{4})$/.test(v) || 'Vaild Year YYYY';
            }
            return true;
          },
        ],
        descriptionRule: [
          v => v.length < 300 || 'Item is to long',
        ],

        degreeOptions: ['Associate of Arts', 'Bachelor of Science', 'Master of Science', 'Master of Business Administration', 'Doctor of Science'],
        genderOptions: ['Male', 'Female'],
        militaryOptions: ['Army', 'Air Force', 'Air Force Reserve', 'Marine Corps', 'Marine Corps Reserve', 'Navy'],
        militaryRankOptions: ['Captain', 'Colonel', 'Lieutenant Colonel', 'Major', 'Lieutenant General', 'Major General', 'Brigadier General', 'Lieutenant', 'Sergeant', 'Vice Admiral'],
        nationalityOptions: ['American', 'Bulgarian', 'Kazakh', 'Russian'],
        statusOptions: ['Active', 'Retired', 'Deceased'],
        suffixOptions: ['Jr.', 'II', 'III'],
        selected: {},
      };
    },

    computed: {
      items() {
        return this.$store.state.astronauts;
      },
      orbitOptions() {
        return this.$store.state.orbitOptions;
      },
      imageData() {
        return this.$store.state.imageData;
      },
    },

    methods: {
      addAlmamater() {
        this.selected.almamaters.push({});
      },

      addAstronaut() {
        this.selected = {
          id: uuidv4(),
          almamaters: [],
        };
      },

      saveAstronaut() {
        if (this.$refs.dataForm.validate()) {
          this.$store.dispatch('saveAstronaut', this.selected);
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
        this.addAstronaut();
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

  #almamaterAdd,
  #payloadAdd {
    width: 20px;
    height: 20px;
    margin-top: 6px;
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

  .formFooter {
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

</style>
