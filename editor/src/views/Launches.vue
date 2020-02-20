<template lang="pug">
v-form.fill-height.d-flex.flex-column
  div.flex-grow-0.fill-width(style="width: 100%")
    v-container.py-0(fluid)
      v-row
        v-col.pb-0(cols="4")
          v-select(
            outlined,
            :items="families",
            item-text="text",
            item-value="id",
            v-model="selectedItem.vehicleFamily",
            label="Rocket Family",
            placeholder=" ",
            :disabled="!!selectedItem.vehicle",
            hide-details
          )
        v-col.pb-0(cols="4")
          v-select(
            outlined,
            clearable
            :items="rockets"
            item-text="text",
            item-value="id",
            v-model="selectedItem.vehicle",
            label="Rocket",
            placeholder=" ",
            no-data-text="Select Rocket Family First",
            hide-details
          )
        v-col.pb-0
          v-text-field(
            outlined,
            v-model="selectedItem.serial",
            label="Serial Number",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-switch(
            :label="selectedItem.orbital ? 'Orbital' : 'Sub-orbital'",
            placeholder=" ",
            v-model="selectedItem.orbital",
          )
      v-row
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.date"
            label="Launch Date",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-select(
            outlined,
            :items="statuses",
            item-text="text",
            item-value="id",
            v-model="selectedItem.status",
            label="Status",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="4")
          v-select(
            outlined,
            :items="launchSites",
            v-model="selectedItem.launchSite",
            label="Launch Site",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            v-model="selectedItem.launchPad",
            label="Launch Pad",
            placeholder=" ",
            hide-details
          )
        v-col.pb-0(cols="2")
          v-text-field(
            outlined,
            append-icon='mdi-video',
            @click:append="launchYouTube(selectedItem.youtube)"
            v-model="selectedItem.youtube",
            label="YouTube ID",
            placeholder=" ",
            hide-details
          )
      v-row
        v-col.pb-0(cols="12")
          v-select(
            outlined,
            multiple,
            :items="astronauts",
            :item-text="getAstronautName",
            item-value="id",
            v-model="selectedItem.crew",
            label="Crew",
            placeholder=" ",
            hide-details
          )
      v-row.ma-0.pa-0.pt-3
        v-divider
      v-row
        v-col(cols="3")
          .title Media
            v-btn(
              text,
              small,
              absolute,
              right,
              @click="showImage = true"
            )
              v-icon mdi-plus
          v-divider
        v-col(cols="9")
          .title Payload ({{ selectedItem.payloads.length }})
            v-btn(text, small, absolute, right, @click="addPayload")
              v-icon mdi-plus
          v-divider
  div.flex-grow-1(style="width: 100%")
    v-container.pa-0(fluid, fill-height)
      v-row.fill-height.pl-3
        v-col.scroll-box.ma-0.pa-0(cols="3")
          .scrolled.pb-4
            div(v-for="item in media")
              v-row.ma-0.pa-0
                v-col.pb-0(cols="2")
                  v-btn(text, fab, @click="removeMedia(item.id)")
                    v-icon mdi-delete
                  v-checkbox.ml-4(:value="item.default", @click="setDefaultMedia(item.id)")
                v-col.pb-0(cols="10")
                  v-img(:src="mediaUrl(item)")
              v-row.ma-0.pa-0
                v-col(cols="12")
                  v-textarea.pb-0(
                    outlined,
                    no-resize,
                    v-model="item.description"
                    label="Description",
                    placeholder=" ",
                    counter="600",
                    rows="16"
                  )
        v-col.scroll-box.ma-0.pa-0(cols="9")
          .scrolled.ml-2
            div(v-for="payload in selectedItem.payloads")
              v-row.ma-0.pa-0
                v-col.pb-0(cols="1")
                  v-btn(text, fab, @click="removePayload(payload.id)")
                    v-icon mdi-delete
                v-col.pb-0(cols="5")
                  v-text-field(
                    outlined,
                    v-model="payload.name",
                    label="Name",
                    placeholder=" ",
                    hide-details
                  )
                v-col.pb-0(cols="3")
                  v-select(
                    outlined,
                    clearable,
                    :items="orbits",
                    :value="payload.orbit",
                    label="Orbit",
                    placeholder=" ",
                    hide-details
                  )
                v-col.pb-0(cols="3")
                  v-text-field(
                    outlined,
                    v-model="payload.mass",
                    label="Mass (kg)",
                    placeholder=" ",
                    hide-details
                  )
              v-row.ma-0.pa-0
                v-col.pb-0(cols="1")
                  v-btn(text, fab, @click="copyPayload(payload)")
                    v-icon mdi-content-copy
                v-col.pb-0(cols="4")
                  v-select(
                    outlined,
                    :items="statuses",
                    item-text="text",
                    item-value="id",
                    v-model="payload.status",
                    label="Status",
                    placeholder=" ",
                    hide-details
                  )
                v-col.pb-0(cols="4")
                  v-select(
                    outlined,
                    :items="payloadTypes",
                    v-model="payload.type",
                    label="Type",
                    placeholder=" ",
                    hide-details
                  )
                v-col.pb-0(cols="3")
                  v-switch(
                    :label="payload.orbital ? 'Orbital' : 'Sub-orbital'",
                    placeholder=" ",
                    v-model="payload.orbital",
                  )
              v-row.ma-0.pa-0
                v-col(cols="1")
                v-col(cols="11")
                  v-textarea.pb-0(
                    outlined,
                    no-resize,
                    v-model="payload.description"
                    label="Description",
                    placeholder=" ",
                    counter="300",
                    rows="2"
                  )
              v-row.ma-0.pa-0
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
        :disabled="!selectedItem.vehicle",
        @click="saveItem"
      ) Save

  v-dialog(v-model="showDelete", width="450")
    v-card
      v-card-title(primary-title) Delete Launch
      v-divider
      v-card-text
        .body-1.mt-4 Are you sure you want to delete this launch?
      v-divider
      v-card-actions
        v-spacer
        v-btn(@click="deleteItem") Yes
        v-btn(@click="showDelete = false") No

  v-dialog(v-model="showImage", width="450")
    v-card
      v-card-title(primary-title) Select Image
      v-divider
      v-card-text
        v-img(
          v-if="previewMediaUrl()",
          width="300",
          :src="previewMediaUrl()",
          style="margin: 20px auto"
        )
        v-file-input(
          accept="image/*",
          clearable,
          placeholder=" ",
          v-model="imageFile"
        )
        v-select(
          outlined,
          :items="sourceTypes",
          v-model="imageSource",
          label="Image Source",
          placeholder=" ",
          hide-details
        )
      v-divider
      v-card-actions
        v-spacer
        v-btn.mr-4(
          :disabled="!imageFile",
          @click="addMedia"
        ) Save
        v-btn(@click="showImage = false") Cancel
</template>

<script>
import { createComponent, ref, watch } from '@vue/composition-api';
import { cloneDeep, findIndex } from 'lodash';
import { ipcRenderer, shell } from 'electron';
import path from 'path';
import fs from 'fs';
import * as uuid from 'uuid/v4';
import EventBus from '../plugins/bus';
import store from '../store';
import { useRouter } from '../router';

const IMG_PATH = path.join(__dirname, '../../../../../../../../../media/');

const _ = {
  cloneDeep,
  findIndex,
};

export default createComponent({
  name: 'launches',
  setup() {
    const router = useRouter();
    const newItem = ref(true);
    const showDelete = ref(false);
    const showImage = ref(false);
    const imageFile = ref(null);
    const imageSource = ref('NASA');
    const selectedItem = ref({
      vehicleFamily: '',
      vehicle: '',
      payloads: [],
    });
    const selectedFamily = ref(null);
    const selectedRocket = ref(null);
    const families = ref([]);
    const rockets = ref([]);
    const media = ref([]);
    const astronauts = ref([]);
    const statuses = ref([
      { text: 'Success', id: 'success' },
      { text: 'Partial Failure', id: 'partial failure' },
      { text: 'Failure', id: 'failure' },
      { text: 'Unknown', id: 'unknown' },
    ]);
    const sourceTypes = ref([
      'NASA',
      'SpaceX',
    ]);
    const launchSites = ref([
      'Cape Canaveral',
      'Kennedy Space Center',
      'Omelek Island',
      'SpaceX McGregor Test Site',
      'Vandenberg AFB',
      'Unknown',
    ]);
    const orbits = ref([
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
    const payloadTypes = ref([
      'Capsule',
      'Satellite',
      'Station',
    ]);

    const launchYouTube = (id) => {
      if (id) {
        shell.openExternal(`https://www.youtube.com/watch?v=${id}`);
      }
    };

    const mediaUrl = (item) => {
      const filename = path.join(IMG_PATH, `thumb/${item.filename}`);
      const file = fs.readFileSync(filename);
      return `data:image/jpeg;base64,${file.toString('base64')}`;
    };

    const previewMediaUrl = () => {
      if (!imageFile.value) {
        return '';
      }
      const file = fs.readFileSync(imageFile.value.path);
      return `data:image/jpeg;base64,${file.toString('base64')}`;
    };

    const addItem = () => {
      selectedItem.value = {
        launchSite: 'Unknown',
        orbital: false,
        payloads: [],
        status: 'unknown',
        vehicleFamily: families.value[0].id,
      };
      selectedFamily.value = store.getters.rocketFamily(families.value[0].id);
    };

    const updateItem = () => {
      newItem.value = true;
      families.value.length = 0;
      store.getters.rockets().forEach((i) => {
        families.value.push({
          id: i.id,
          text: i.name,
        });
      });
      families.value.sort((a, b) => (a.text < b.text ? -1 : 1));

      selectedItem.value = null;
      if (router.currentRoute.params.id) {
        selectedItem.value = _.cloneDeep(store.getters.launch(router.currentRoute.params.id));
        if (selectedItem.value) {
          newItem.value = false;
          selectedFamily.value = store.getters.rocketFamily(selectedItem.value.vehicleFamily);
          selectedRocket.value = store.getters.rocket(
            selectedItem.value.vehicleFamily,
            selectedItem.value.vehicle,
          );
        }

        media.value.length = 0;
        store.getters.launchMedia(selectedItem.value.id).forEach((i) => {
          media.value.push(i);
        });

        astronauts.value.length = 0;
        store.getters.astronauts().forEach((i) => {
          astronauts.value.push(i);
        });
      }

      if (!selectedItem.value) {
        addItem();
      }
    };

    const getAstronautName = item => `${item.firstName} ${item.lastName}`;

    const setDefaultMedia = (id) => {
      media.value.forEach((i) => {
        const img = i;
        img.default = false;
        if (img.id === id) {
          img.default = true;
        }
      });
    };

    const addPayload = () => {
      selectedItem.value.payloads.push({
        name: '',
        orbital: false,
        orbit: '',
        mass: 0,
        type: 'Satellite',
        description: '',
        id: uuid(),
        status: 'unknown',
      });
    };

    const copyPayload = (payload) => {
      selectedItem.value.payloads.push({
        name: payload.name,
        orbital: payload.orbital,
        orbit: payload.orbit,
        mass: payload.mass,
        type: payload.type,
        description: payload.description,
        id: uuid(),
        status: payload.status,
      });
    };

    const removePayload = (id) => {
      const idx = _.findIndex(selectedItem.value.payloads, { id });
      selectedItem.value.payloads.splice(idx, 1);
    };


    const addMedia = () => {
      showImage.value = false;
      const infile = imageFile.value.path;
      const filename = imageFile.value.name.split('.')[0];
      const outfile = path.join(IMG_PATH, `thumb/${imageSource.value.toLowerCase()}/${filename}.jpg`);
      ipcRenderer.send('jimp-launch-media', {
        infile,
        outfile,
      });
      imageFile.value = null;
    };

    const removeMedia = (id) => {
      const idx = _.findIndex(media.value, { id });
      media.value.splice(idx, 1);
    };

    const deleteItem = () => {
      store.mutations.deleteLaunch(selectedItem.value).then(() => {
        EventBus.$emit('refreshList', true);
      });
    };

    const saveItem = () => {
      store.mutations.saveLaunch(selectedItem.value).then((id) => {
        EventBus.$emit('refreshList', id);
      });
    };

    watch(
      () => (selectedItem.value ? selectedItem.value.vehicleFamily : null),
      () => {
        if (selectedItem.value === null) {
          rockets.value.length = 0;
          addItem();
          return;
        }

        selectedFamily.value = store.getters.rocketFamily(selectedItem.value.vehicleFamily);
        rockets.value.length = 0;
        if (selectedFamily.value) {
          selectedFamily.value.rockets.forEach((i) => {
            rockets.value.push({
              id: i.id,
              text: i.name,
            });
          });
        }
      },
    );

    watch(
      () => router.currentRoute,
      () => updateItem(),
    );

    return {
      showDelete,
      showImage,
      selectedItem,
      selectedFamily,
      selectedRocket,
      astronauts,
      mediaUrl,
      setDefaultMedia,
      families,
      rockets,
      statuses,
      launchSites,
      launchYouTube,
      orbits,
      getAstronautName,
      media,
      payloadTypes,
      addPayload,
      copyPayload,
      removePayload,
      addMedia,
      removeMedia,
      deleteItem,
      saveItem,
      sourceTypes,
      imageFile,
      imageSource,
      previewMediaUrl,
    };
  },
});
</script>

<style lang="sass" scoped>
.col
  position: relative
</style>
