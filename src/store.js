/* eslint-disable no-param-reassign */
import Vue from 'vue';
import { filter, groupBy } from 'lodash/';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    launchesByYear: [],
    launchesByFamily: [],
    mediaByLaunch: [],
  },

  mutations: {
    updateLaunchData(state) {
      fetch('/launches.json')
        .then(resp => resp.json())
        .then((data) => {
          const filteredData = filter(data, l => l.date.length > 0);
          state.launchesByYear = groupBy(filteredData, l => l.date.split('-')[0]);
          state.launchesByFamily = groupBy(filteredData, l => l.vehicleFamily);
        })
        .catch((error) => {
          console.log('err', error);
        });
    },

    updateMediaData(state) {
      fetch('/media.json')
        .then(resp => resp.json())
        .then((data) => {
          const filteredData = filter(data, m => m.launchID.length > 0);
          state.launchesByFamily = groupBy(filteredData, m => m.launchID);
        })
        .catch((error) => {
          console.log('err', error);
        });
    },
  },

  actions: {
    updateData(context) {
      context.commit('updateLaunchData');
      context.commit('updateMediaData');
    },
  },
});
