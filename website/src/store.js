/* eslint-disable no-param-reassign */
import Vue from 'vue';
import { filter, sortBy, groupBy, map } from 'lodash/';
import Vuex from 'vuex';

Vue.use(Vuex);

const incLoaded = (state) => {
  state.loaded += 1;
  if (state.loaded === 4) {
    state.isReady = true;
  }
};

export default new Vuex.Store({
  state: {
    launchesByYear: [],
    launchesByFamily: [],
    launches: [],
    mediaByLaunch: [],
    astronauts: [],
    families: [],
    loaded: 0,
    isReady: false,
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
          state.launches = filteredData;
          state.launchesByYear = groupBy(filteredData, l => l.date.split('-')[0]);
          state.launchesByFamily = groupBy(filteredData, l => l.vehicleFamily);
          incLoaded(state);
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
          incLoaded(state);
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
          incLoaded(state);
        })
        .catch((error) => {
          console.log('err', error);
        });
    },

    updateAstronauts(state) {
      fetch('/data/astronauts.json')
        .then(resp => resp.json())
        .then((data) => {
          state.astronauts = data;
          incLoaded(state);
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
      context.commit('updateAstronauts');
    },
  },
});
