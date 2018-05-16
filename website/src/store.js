/* eslint-disable no-param-reassign */
import Vue from 'vue';
import { filter, sortBy, groupBy, map } from 'lodash/';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    launchesByYear: [],
    launchesByFamily: [],
    mediaByLaunch: [],
    families: [],
  },

  mutations: {
    updateLaunchData(state) {
      fetch('/data/launches.json')
        .then(resp => resp.json())
        .then((data) => {
          const filteredData = map(sortBy(filter(data, l => l.date.length > 0), 'date'), (l) => {
            l.payloads = l.payloads ? l.payloads : [];
            l.payloads = map(l.payloads, (p) => {
              p.status = p.status ? p.status : l.status;
              return p;
            });

            return l;
          });
          state.launchesByYear = groupBy(filteredData, l => l.date.split('-')[0]);
          state.launchesByFamily = groupBy(filteredData, l => l.vehicleFamily);
        })
        .catch((error) => {
          console.log('err', error);
        });
    },

    updateMediaData(state) {
      fetch('/data/media.json')
        .then(resp => resp.json())
        .then((data) => {
          const filteredData = filter(data, m => m.launchID.length > 0);
          state.mediaByLaunch = groupBy(filteredData, m => m.launchID);
        })
        .catch((error) => {
          console.log('err', error);
        });
    },

    updateFamilies(state) {
      fetch('/data/families.json')
        .then(resp => resp.json())
        .then((data) => {
          state.families = data;
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
      context.commit('updateFamilies');
    },
  },
});
