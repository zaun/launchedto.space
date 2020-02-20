<template lang="pug">
v-container(fluid, fill-height)
  v-row(align="center", justify="center")
    v-card(width="350")
      v-card-title About
      v-card-text
        p This is the editor for http://launchedto.space. Select the
          | items you would like to edit in the top menu bar.
  v-footer(app)
    v-container.pa-0.ma-0(fluid)
      v-row(dense)
        v-col(col="8")
        v-col.text-right(cols="4")
          | Electron: {{ footerInfo.electronVersion }} ~
          | Vue: {{ footerInfo.vueVersion }} ~
          | Vuetify: {{ footerInfo.vuetifyVersion }}
</template>

<script>
import { createComponent, reactive } from '@vue/composition-api';
import Vue from 'vue';
import Vuetify from 'vuetify';

export default createComponent({
  name: 'home',
  setup() {
    const footerInfo = reactive({
      electronVersion: process.versions.electron,
      vueVersion: Vue.version,
      vuetifyVersion: Vuetify.version,
    });

    return {
      footerInfo,
    };
  },
});
</script>
