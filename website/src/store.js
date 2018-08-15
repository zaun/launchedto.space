/* eslint-disable no-param-reassign */
import Vue from 'vue';
import { countBy, filter, includes, groupBy, map, sortBy } from 'lodash/';
import Vuex from 'vuex';

Vue.use(Vuex);

const incLoaded = (state) => {
  state.loaded += 1;
  if (state.loaded === 4) {
    state.isReady = true;
  }
};

const updateCache = (state) => {
  if (!state.isReady) {
    return Promise.reject(new Error('Update skipped, not ready'));
  }

  state.isReady = false;
  return new Promise((resolve) => {
    // Launch data
    const sortedDataL = sortBy(filter(state.raw.launches, l => l.date.length > 0), 'date');
    const cleanDataL = map(sortedDataL, (l) => {
      l.payloads = l.payloads ? l.payloads : [];
      l.payloads = map(l.payloads, (p) => {
        p.status = p.status ? p.status : l.status;
        return p;
      });

      return l;
    });
    const filteredDataL = filter(cleanDataL, (l) => {
      const found = includes(state.filter.families, l.vehicleFamily);
      return found || state.filter.families.length === 0;
    });
    state.cache.launchesByYear = groupBy(filteredDataL, l => l.date.split('-')[0]);
    state.cache.launchesByFamily = groupBy(filteredDataL, l => l.vehicleFamily);
    state.cache.launchesByRocket = groupBy(filteredDataL, l => l.vehicle);
    state.cache.launchCountByRocket = countBy(filteredDataL, l => l.vehicle);

    // Rocket Family data
    const filteredDataF = filter(state.raw.families, (f) => {
      const found = includes(state.filter.families, f.id);
      return found || state.filter.families.length === 0;
    });
    state.cache.storedFamilies = sortBy(filteredDataF, 'name');
    state.cache.familyOptions = map(state.raw.families, f => ({
      value: f.id,
      text: f.name,
    }));

    // Media
    const filteredDataM = filter(state.raw.media, m => m.launchID.length > 0);
    state.cache.mediaByLaunch = groupBy(filteredDataM, m => m.launchID);

    console.info('Updated cached data');
    state.isDirty = false;
    state.isReady = true;
    resolve();
  });
};

export default new Vuex.Store({
  state: {
    loaded: 0,

    raw: {
      astronauts: [],
      families: [],
      launches: [],
      media: [],
    },

    cache: {
      launchesByYear: [],
      launchesByFamily: [],
      launchesByRocket: [],
      launchCountByRocket: {},
      mediaByLaunch: [],
      storedFamilies: [],

      familyOptions: [],
    },

    filter: {
      families: [],
      years: [],
    },

    isDirty: false,
    isReady: false,
  },

  getters: {
    astronauts: state => state.raw.astronauts,

    families: (state) => {
      if (state.isDirty) {
        updateCache(state).catch(() => {});
      }

      return state.cache.storedFamilies;
    },

    familyOptions: (state) => {
      if (state.isDirty) {
        updateCache(state).catch(() => {});
      }

      return state.cache.familyOptions;
    },

    launches: state => state.raw.launches,

    launchesByYear: (state) => {
      if (state.isDirty) {
        updateCache(state).catch(() => {});
      }

      return state.cache.launchesByYear;
    },

    launchesByFamily: (state) => {
      if (state.isDirty) {
        updateCache(state).catch(() => {});
      }

      return state.cache.launchesByFamily;
    },

    launchesByRocket: (state) => {
      if (state.isDirty) {
        updateCache(state).catch(() => {});
      }

      return state.cache.launchesByRocket;
    },

    launchCountByRocket: (state) => {
      if (state.isDirty) {
        updateCache(state).catch(() => {});
      }

      return state.cache.launchCountByRocket;
    },

    mediaByLaunch: (state) => {
      if (state.isDirty) {
        updateCache(state).catch(() => {});
      }

      return state.cache.mediaByLaunch;
    },
  },

  mutations: {
    updateFilter(state, data) {
      state.filter[data.prop] = data.value;
      state.isDirty = true;
    },

    loadData(state, file) {
      fetch(`/data/${file}.json`)
        .then(resp => resp.json())
        .then((data) => {
          state.raw[file] = data;
          state.isDirty = true;
          incLoaded(state);
        })
        .catch((error) => {
          console.error(`Error loading file ${file}`, error);
        });
    },
  },

  actions: {
    loadData(context) {
      context.commit('loadData', 'astronauts');
      context.commit('loadData', 'families');
      context.commit('loadData', 'launches');
      context.commit('loadData', 'media');
    },

    updateFilter(context, data) {
      context.commit('updateFilter', data);
    },
  },
});
