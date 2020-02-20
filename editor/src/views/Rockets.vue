<template lang="pug">
.rockets.fill-height
  v-form.fill-height.d-flex.flex-column
    div.flex-grow-0(style="width: 100%")
      v-container.py-0(fluid)
        v-row
          v-col.pb-0(cols="2")
            v-text-field(
              outlined,
              disabled,
              :value="rocketFamilyName()",
              label="Rocket Family",
              placeholder=" ",
              hide-details
            )
          v-col.pb-0(cols="2")
            v-text-field(
              outlined,
              v-model="selectedItem.name",
              label="Rocket Name",
              placeholder=" ",
              hide-details
            )
          v-col.pb-0(cols="2")
            v-text-field(
              outlined,
              v-model="selectedItem.height",
              label="Height (m)",
              placeholder=" ",
              hide-details
            )
          v-col.pb-0(cols="2")
            v-text-field(
              outlined,
              v-model="selectedItem.diameter",
              label="Diameter (m)",
              placeholder=" ",
              hide-details
            )
          v-col.pb-0(cols="2")
            v-text-field(
              outlined,
              v-model="selectedItem.span",
              label="Span (m)",
              placeholder=" ",
              hide-details
            )
          v-col.pb-0(cols="2")
            v-select(
              outlined,
              :items="expendableTypes",
              v-model="selectedItem.expendable",
              label="Expendable",
              placeholder=" ",
              hide-details
            )
        v-row
          v-col.pb-0(cols="2")
            v-btn Set Image
          v-col.pb-0(cols="10")
            .rocket-image
              .image-container
                label Rocket Image
        v-row
          v-col.pb-0(cols="3")
            v-select(
              outlined,
              :items="payloadTypes",
              v-model="selectedItem.payloadType",
              label="Payload Type",
              placeholder=" ",
              hide-details
            )
          v-col.pb-0(cols="3")
            v-text-field(
              outlined,
              append-icon='mdi-web',
              @click:append="launchWeb(selectedItem.wikipediaURL)"
              v-model="selectedItem.wikipediaURL",
              label="Wikipedia",
              placeholder=" ",
              hide-details
            )
          v-col.pb-0(cols="3")
            v-text-field(
              outlined,
              append-icon='mdi-web',
              @click:append="launchWeb(selectedItem.astronautixURL)"
              v-model="selectedItem.astronautixURL",
              label="Astronautix",
              placeholder=" ",
              hide-details
            )
          v-col.pb-0(cols="3")
            v-text-field(
              outlined,
              append-icon='mdi-web',
              @click:append="launchWeb(selectedItem.skyrocketURL)"
              v-model="selectedItem.skyrocketURL",
              label="Skyrocket",
              placeholder=" ",
              hide-details
            )
        v-row.ma-0.pa-0.pt-3
          v-divider
        v-row
          v-col(cols="3")
            .title Payload ({{ selectedItem.payloads.length }})
              v-btn(text, small, absolute, right, @click="addPayload")
                v-icon mdi-plus
            v-divider
          v-col(cols="9")
            .title Stages ({{ selectedItem.stages.length }})
              v-btn(text, small, absolute, right, @click="addStage")
                v-icon mdi-plus
            v-divider
    div.flex-grow-1(style="width: 100%")
      v-container.pa-0(fluid, fill-height)
        v-row.fill-height.pl-3
          v-col.scroll-box.ma-0.pa-0(cols="3")
            .scrolled
              div(v-for="payload, idx in selectedItem.payloads")
                v-row.ma-0.pa-0
                  v-col.pb-0(cols="2")
                    v-btn(text, fab, @click="removePayload(idx)")
                      v-icon mdi-delete
                  v-col.pb-0(cols="5")
                    v-select(
                      outlined,
                      :items="orbitsTypes",
                      v-model="payload.orbit",
                      label="Orbit",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="5")
                    v-text-field(
                      outlined,
                      v-model="payload.capacity",
                      label="Capacity (kg)",
                      placeholder=" ",
                      hide-details
                    )
          v-col.scroll-box.ma-0.pa-0(cols="9")
            .scrolled.ml-2
              div(v-for="stage, idx in selectedItem.stages")
                v-row.ma-0.pa-0
                  v-col.pb-0(cols="1")
                    v-btn(text, fab, @click="removeStage(idx)")
                      v-icon mdi-delete
                  v-col.pb-0(cols="3")
                    v-text-field(
                      outlined,
                      v-model="stage.name",
                      label="Name",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="stage.emptyMass",
                      label="Empty Mass (kg)",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="stage.grossMass",
                      label="Gross Mass (kg)",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="stage.seaLevelIsp",
                      label="Sea Level ISP",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="stage.isp",
                      label="ISP",
                      placeholder=" ",
                      hide-details
                    )
                v-row.ma-0.pa-0
                  v-col.pb-0(cols="1")
                  v-col.pb-0(cols="3")
                    v-text-field(
                      outlined,
                      v-model="stage.propellants",
                      label="Propellants",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="stage.height",
                      label="Height (m)",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="stage.diameter",
                      label="Diameter (m)",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="stage.span",
                      label="Span (m)",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="stage.burnTime",
                      label="Burn Time (s)",
                      placeholder=" ",
                      hide-details
                    )
                v-row.ma-0.pa-0
                  v-col.pb-0(cols="4")
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="stage.thrust",
                      label="Thrust (kN)",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="stage.thrustVac",
                      label="Thrust Vac (kN)",
                      placeholder=" ",
                      hide-details
                    )
                v-row.ma-0.pa-0
                  v-col.pb-0(cols="2")
                  v-col.pb-0(cols="10")
                    v-divider
                v-row.ma-0.pa-0(v-if="stage.engines.length === 0")
                  v-col.pb-0(cols="1")
                    v-btn(v-if="idx === 0", small, text, fab, @click="addEngine(stage)")
                      v-icon mdi-plus
                  v-col.pb-0(cols="11")
                    .text Click the plus button to add an engine.
                v-row.ma-0.pa-0(
                  v-if="stage.engines.length > 0"
                  v-for="engine, idx in stage.engines"
                )
                  v-col.pb-0(cols="2")
                    v-btn.float-right(small, text, fab, @click="removeEngine(stage, idx)")
                      v-icon mdi-delete
                    v-btn.float-right(v-if="idx === 0", small, text, fab, @click="addEngine(stage)")
                      v-icon mdi-plus
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="engine.name",
                      label="Engine Name",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="engine.count",
                      label="Count",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="engine.thrust",
                      label="Thrust (kN)",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      v-model="engine.thrustVac",
                      label="Thrust Vac (kN)",
                      placeholder=" ",
                      hide-details
                    )
                  v-col.pb-0(cols="2")
                    v-text-field(
                      outlined,
                      disabled,
                      :value="getTotalThrust(engine)",
                      label="Total Thrust (kN)",
                      placeholder=" ",
                      hide-details
                    )
                v-row.ma-0.pa-0.pt-3
                  v-divider
    div.flex-grow-0(style="width: 100%")
      v-toolbar(dense)
        v-spacer
        v-btn.mr-4(
          :disabled="!selectedItem.id",
          @click="showDelete = true"
        ) Delete
        div.mr-4
        v-btn.mr-4(
          :disabled="!selectedFamily || !selectedItem.name",
          @click="saveItem"
        ) Save

  v-dialog(v-model="showAddGroup", width="600")
    v-card
      v-card-title(primary-title) Add New Rocket Family
      v-divider
      v-card-text
        v-container.ma-0.pa-0
          v-row
            v-col
              v-text-field(
                outlined,
                v-model="newRocketFamilyName",
                label="Rocket Family name",
                placeholder=" ",
                hide-details
              )
          v-row
            v-col
              v-textarea.pb-0(
                outlined,
                no-resize,
                v-model="newRocketFamilyDescription"
                label="Description",
                placeholder=" ",
                counter="300",
                rows="3"
              )
      v-divider
      v-card-actions
        v-spacer
        v-btn(
          @click="addRocketFamily",
          :disabled="!newRocketFamilyName || !newRocketFamilyDescription"
        ) Add
        v-btn(@click="showAddGroup = false") Cancel

  v-dialog(v-model="showDelete", width="450")
    v-card
      v-card-title(primary-title) Delete Rocket
      v-divider
      v-card-text
        .body-1.mt-4 Are you sure you want to delete this rocket?
      v-divider
      v-card-actions
        v-spacer
        v-btn(@click="deleteItem") Yes
        v-btn(@click="showDelete = false") No
</template>

<script>
import { createComponent, ref, watch } from '@vue/composition-api';
import { shell } from 'electron';
import { cloneDeep, findIndex } from 'lodash';
import EventBus from '../plugins/bus';
import store from '../store';
import { useRouter } from '../router';

const _ = {
  cloneDeep,
  findIndex,
};

export default createComponent({
  name: 'rockets',
  setup() {
    const router = useRouter();
    const showDelete = ref(false);
    const selectedItem = ref(null);
    const selectedFamily = ref(null);
    const expendableTypes = ref([
      { text: 'Yes', id: 'yes' },
      { text: 'No', id: 'no' },
      { text: 'Unknown', id: 'unknown' },
    ]);
    const payloadTypes = ref([
      'Capsule',
      'Fairing',
      'None',
    ]);
    const orbitsTypes = ref([
      'Karmen',
      'LEO',
      'LPEO',
      'MEO',
      'Molniya',
      'HEO',
      'GEO',
      'GTO',
      'SSO',
      'TLI',
      'IP',
    ]);
    const newRocketFamilyName = ref('');
    const newRocketFamilyDescription = ref('');
    const showAddItem = ref(false);
    const showAddGroup = ref(false);

    const launchWeb = (url) => {
      if (url) {
        shell.openExternal(url);
      }
    };

    const getTotalThrust = (engine) => {
      const t = engine.thrust ? parseFloat(engine.thrust) : 0;
      const tv = engine.thrustVac ? parseFloat(engine.thrustVac) : 0;
      const c = engine.count ? parseInt(engine.count, 10) : 0;
      return ((t + tv) * c).toFixed(3);
    };

    const rocketFamilyName = () => {
      let name = 'Unknown';
      if (selectedFamily.value) {
        // eslint-disable-next-line prefer-destructuring
        name = selectedFamily.value.name;
      }
      return name;
    };

    const updateItem = () => {
      if (router.currentRoute.params.id) {
        selectedItem.value = _.cloneDeep(store.getters.rocket(
          router.currentRoute.params.fam,
          router.currentRoute.params.id,
        ));
      } else {
        selectedItem.value = {
          payloads: [],
          stages: [],
        };
        selectedFamily.value = {};
      }
      if (router.currentRoute.params.fam) {
        selectedFamily.value = store.getters.rocketFamily(router.currentRoute.params.fam);
      } else {
        selectedFamily.value = {};
      }
    };

    const addPayload = () => {
      selectedItem.value.payloads.push({
        orbit: 'LEO',
        capacity: 0,
      });
    };

    const removeEngine = (stage, idx) => {
      stage.engines.splice(idx, 1);
    };

    const removePayload = (idx) => {
      selectedItem.value.payloads.splice(idx, 1);
    };

    const removeStage = (idx) => {
      selectedItem.value.stages.splice(idx, 1);
    };

    const addEngine = (stage) => {
      stage.engines.push({});
    };

    const addStage = () => {
      selectedItem.value.stages.push({
        engines: [],
      });
    };

    const addRocketFamily = () => {
      if (newRocketFamilyName.value === '' || newRocketFamilyDescription.value === '') {
        return;
      }
      const family = {
        name: newRocketFamilyName.value,
        description: newRocketFamilyDescription.value,
        rockets: [],
      };
      store.mutations.saveRocketFamily(family).then(() => {
        showAddGroup.value = false;
        EventBus.$emit('refreshList', true);
      });
    };

    const deleteItem = () => {
      store.mutations.deleteRocket(selectedFamily.value, selectedItem.value).then(() => {
        EventBus.$emit('refreshList', true);
      });
    };

    const saveItem = () => {
      store.mutations.saveRocket(selectedFamily.value, selectedItem.value).then((id) => {
        EventBus.$emit('refreshList', id);
      });
    };

    watch(
      () => router.currentRoute,
      () => updateItem(),
    );

    EventBus.$on('AddGroup', () => {
      newRocketFamilyName.value = '';
      newRocketFamilyDescription.value = '';
      showAddGroup.value = true;
    });

    return {
      showDelete,
      showAddItem,
      showAddGroup,
      newRocketFamilyName,
      addRocketFamily,
      addPayload,
      addEngine,
      addStage,
      expendableTypes,
      getTotalThrust,
      launchWeb,
      orbitsTypes,
      payloadTypes,
      selectedFamily,
      selectedItem,
      removeEngine,
      removePayload,
      removeStage,
      rocketFamilyName,
      newRocketFamilyDescription,
      deleteItem,
      saveItem,
    };
  },
});
</script>

<style lang="scss" scoped>
.rocket-image {
  position: relative;
  color: rgba(0, 0, 0, 0.87);
  border: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 4px;
  margin-bottom: 20px;
  .image-container {
    padding: 0 12px;
    min-height: 56px;
    width: 900px;
    label {
      position: absolute;
      left: 0px;
      right: auto;
      color: rgba(0, 0, 0, 0.6);
      background-color: white;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      transform: translateY(-10px) scale(0.75);
    }
  }
}
</style>

<style lang="sass" scoped>
.col
  position: relative
.scrolled
  position: absolute
  top: 0
  bottom: 0
  left: 0
  right: 0
  overflow-y: auto
</style>
