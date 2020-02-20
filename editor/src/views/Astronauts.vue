<template lang="pug">
v-form.fill-height.d-flex.flex-column
  div.flex-grow-0.fill-width(style="width: 100%")
    v-container.py-0(fluid)
      v-row
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            required,
            v-model="selectedItem.firstName",
            label="First Name *",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.middleName",
            label="Middle Name",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            required,
            v-model="selectedItem.lastName",
            label="Last Name *",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.nickName",
            label="Nickname",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-select(
            outlined,
            clearable,
            :items="titleTypes"
            item-text="text",
            item-value="id",
            v-model="selectedItem.title",
            label="Title",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-select(
            outlined,
            clearable,
            :items="suffixTypes"
            item-text="text",
            item-value="id",
            v-model="selectedItem.suffix",
            label="Suffix",
            placeholder=" ",
            hide-details
          )
      v-row
        v-col.pb-0(cols="2")
          v-select(
            outlined,
            clearable,
            :items="nationalityTypes"
            v-model="selectedItem.nationality",
            label="Nationality",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.birthDate",
            label="Birth Date",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.birthCity",
            label="Birth City",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="3")
          v-text-field(
            outlined,
            v-model="selectedItem.birthReagon",
            label="Birth Province / State",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="3")
          v-text-field(
            outlined,
            v-model="selectedItem.birthCountry",
            label="Birth Country",
            placeholder=" ",
            hide-details
          )
      v-row
        v-col.pb-0(cols="2")
          v-select(
            outlined,
            clearable,
            :items="genderTypes"
            item-text="text",
            item-value="id",
            v-model="selectedItem.gender",
            label="Gender",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.deathDate",
            label="Death Date",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.deathCity",
            label="Death City",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="3")
          v-text-field(
            outlined,
            v-model="selectedItem.deathReagon",
            label="Death Province / State",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="3")
          v-text-field(
            outlined,
            v-model="selectedItem.deathCountry",
            label="Death Country",
            placeholder=" ",
            hide-details
          )
      v-row
        v-col.pb-0(cols="3")
          v-select(
            outlined,
            clearable,
            :items="militaryTypes"
            v-model="selectedItem.military",
            label="Final Military Service",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="3")
          v-select(
            outlined,
            clearable,
            :items="militaryRankTypes"
            v-model="selectedItem.militaryRank",
            label="Final Military Rank",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.militaryYears",
            label="Years in Service",
            placeholder=" ",
            hide-details
          )
      v-row
        v-col.pb-0(cols="3")
          v-select(
            outlined,
            :items="statusTypes"
            v-model="selectedItem.status",
            label="Status",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="9")
          v-select(
            outlined,
            clearable,
            multiple,
            :items="groupTypes"
            v-model="selectedItem.group",
            label="Selection Group(s)",
            placeholder=" ",
            hide-details
          )
      v-row
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.timeInSpaceDays",
            label="Time in Space (d)",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.timeInSpaceHours",
            label="Time in Space (h)",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.timeInSpaceMinutes",
            label="Time in Space (m)",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.evaHours",
            label="EVA Time (h)",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.evaMinutes",
            label="EVA Time (m)",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.evaCount",
            label="EVA Count",
            placeholder=" ",
            hide-details
          )
      v-row.ma-0.pa-0.pt-3
        v-divider
      v-row
        v-col(cols="3")
          .title Mission ({{ selectedItem.missions.length }})
            v-btn(text, small, absolute, right, @click="addMission")
              v-icon mdi-plus
          v-divider
        v-col(cols="9")
          .title Almamaters ({{ selectedItem.almamaters.length }})
            v-btn(text, small, absolute, right, @click="addAlmamater")
              v-icon mdi-plus
          v-divider
  div.flex-grow-1(style="width: 100%")
    v-container.pa-0(fluid, fill-height)
      v-row.fill-height.pl-3
        v-col.scroll-box.ma-0.pa-0(cols="3")
          .scrolled.ml-2
            div(v-for="mission, idx in selectedItem.missions")
              v-row.ma-0.pa-0
                .flex-shrink-1.pb-0.mt-3
                  v-btn(text, fab, @click="removeMission(idx)")
                    v-icon mdi-delete
                .flex-grow-1.pb-0.mt-3.mr-2
                  v-text-field(
                    outlined,
                    v-model="mission.name",
                    label="Mission",
                    placeholder=" ",
                    hide-details
                  )
        v-col.scroll-box.ma-0.pa-0(cols="9")
          .scrolled.ml-2
            div(v-for="almamater, idx in selectedItem.almamaters")
              v-row.ma-0.pa-0
                .flex-shrink-1.pb-0.mt-3
                  v-btn(text, fab, @click="removeAlmamater(idx)")
                    v-icon mdi-delete
                .flex-grow-1.pb-0.mt-3.mr-2
                  v-text-field(
                    outlined,
                    v-model="almamater.name",
                    label="School Name",
                    placeholder=" ",
                    hide-details
                  )
                v-col.pb-0(cols="1")
                  v-text-field(
                    outlined,
                    v-model="almamater.year",
                    label="Year",
                    placeholder=" ",
                    hide-details
                  )
                v-col.pb-0(cols="4")
                  v-select(
                    outlined,
                    clearable,
                    :items="degreeTypes"
                    v-model="almamater.degree",
                    label="Degree",
                    placeholder=" ",
                    hide-details
                  )
                v-col.pb-0(cols="3")
                  v-text-field(
                    outlined,
                    v-model="almamater.fieldOfStudy",
                    label="Field of Study",
                    placeholder=" ",
                    hide-details
                  )
  div.flex-grow-0(style="width: 100%")
    v-toolbar(dense)
      v-spacer
      v-btn.mr-4(
        :disabled="!selectedItem.id",
        @click="showDelete = true"
      ) Delete
      div.mr-4
      v-btn.mr-4(
        :disabled="!selectedItem.firstName || !selectedItem.lastName",
        @click="saveItem"
      ) Save

  v-dialog(v-model="showDelete", width="450")
    v-card
      v-card-title(primary-title) Delete Astronaut
      v-divider
      v-card-text
        .body-1.mt-4 Are you sure you want to delete this astronaut?
      v-divider
      v-card-actions
        v-spacer
        v-btn(@click="deleteItem") Yes
        v-btn(@click="showDelete = false") No
</template>

<script>
import { createComponent, ref, watch } from '@vue/composition-api';
import EventBus from '../plugins/bus';
import store from '../store';
import { useRouter } from '../router';

export default createComponent({
  name: 'astronaut',
  setup() {
    const router = useRouter();
    const selectedItem = ref({});
    const showDelete = ref(false);
    const titleTypes = ref([
      'Viscount',
    ]);
    const suffixTypes = ref([
      'Jr',
      'II',
      'III',
    ]);
    const genderTypes = ref([
      'Male',
      'Female',
    ]);
    const statusTypes = ref([
      'Active',
      'Retired',
      'Deceased',
      'Unknown',
    ]);
    const groupTypes = ref([
      '1959 - NASA Group 1',
      '1960 - Dyna–Soar Group 1',
      '1960 - USSR Air Force Group 1',
      '1962 - Dyna–Soar Group 2',
      '1962 - NASA Group 2',
      '1962 - USSR Female Group',
      '1963 - NASA Group 3',
      '1963 - USSR Air Force Group 2',
    ]);
    const nationalityTypes = ref([
      'American',
      'Bulgarian',
      'Kazakh',
      'Russian',
    ]);
    const militaryTypes = ref([
      'Army',
      'Air Force',
      'Air Force Reserve',
      'Marine Corps',
      'Marine Corps Reserve',
      'Navy',
    ]);
    const militaryRankTypes = ref([
      'Captain',
      'Colonel',
      'Lieutenant Colonel',
      'Major',
      'Lieutenant General',
      'Major General',
      'Brigadier General',
      'Lieutenant',
      'Sergeant',
      'Vice Admiral',
      'Admiral',
    ]);
    const degreeTypes = ref([
      'Associate of Arts',
      'Bachelor of Science',
      'Master of Science',
      'Doctor of Science',
      'Master of Business Administration',
    ]);

    const addItem = () => {
      selectedItem.value = {
        status: 'Unknown',
        almamaters: [],
        missions: [],
      };
    };

    const addMission = () => {
      selectedItem.value.missions.push({});
    };

    const removeMission = (index) => {
      selectedItem.value.missions.splice(index, 1);
    };

    const addAlmamater = () => {
      selectedItem.value.almamaters.push({});
    };

    const removeAlmamater = (index) => {
      selectedItem.value.almamaters.splice(index, 1);
    };

    const updateItem = () => {
      if (router.currentRoute.params.id) {
        selectedItem.value = _.cloneDeep(store.getters.astronaut(router.currentRoute.params.id));
        if (!selectedItem.value) {
          selectedItem.value = {};
          router.push({ name: 'astronauts' });
        }
      } else {
        addItem();
      }
    };

    const deleteItem = () => {
      store.mutations.deleteAstronaut(selectedItem.value).then(() => {
        EventBus.$emit('refreshList', true);
      });
    };

    const saveItem = () => {
      store.mutations.saveAstronaut(selectedItem.value).then((id) => {
        EventBus.$emit('refreshList', id);
      });
    };

    watch(
      () => router.currentRoute,
      () => updateItem(),
    );

    return {
      showDelete,
      addMission,
      removeMission,
      addAlmamater,
      removeAlmamater,
      titleTypes,
      degreeTypes,
      genderTypes,
      groupTypes,
      militaryTypes,
      militaryRankTypes,
      nationalityTypes,
      selectedItem,
      statusTypes,
      suffixTypes,
      deleteItem,
      saveItem,
    };
  },
});
</script>

<style lang="sass" scoped>
.title
  position: relative
</style>
