/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const worker = new Worker('/worker.js');

const incLoaded = (state) => {
  state.loaded += 1;
  if (state.loaded === 4) {
    state.isReady = true;
  }
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
      if (state.isDirty && state.isReady) {
        state.isReady = false;

        worker.addEventListener('message', (result) => {
          state.cache = result.data;
          state.isReady = true;
          state.isDirty = false;
        }, { once: true });

        worker.postMessage({
          cmd: 'processRaw',
          raw: state.raw,
          filterInfo: state.filter,
        });
      }

      return state.cache.storedFamilies;
    },

    familyOptions: (state) => {
      if (state.isDirty && state.isReady) {
        state.isReady = false;

        worker.addEventListener('message', (result) => {
          state.cache = result.data;
          state.isReady = true;
          state.isDirty = false;
        }, { once: true });

        worker.postMessage({
          cmd: 'processRaw',
          raw: state.raw,
          filterInfo: state.filter,
        });
      }

      return state.cache.familyOptions;
    },

    launches: state => state.raw.launches,

    launchesByYear: (state) => {
      if (state.isDirty && state.isReady) {
        state.isReady = false;

        worker.addEventListener('message', (result) => {
          state.cache = result.data;
          state.isReady = true;
          state.isDirty = false;
        }, { once: true });

        worker.postMessage({
          cmd: 'processRaw',
          raw: state.raw,
          filterInfo: state.filter,
        });
      }

      return state.cache.launchesByYear;
    },

    launchesByFamily: (state) => {
      if (state.isDirty && state.isReady) {
        state.isReady = false;

        worker.addEventListener('message', (result) => {
          state.cache = result.data;
          state.isReady = true;
          state.isDirty = false;
        }, { once: true });

        worker.postMessage({
          cmd: 'processRaw',
          raw: state.raw,
          filterInfo: state.filter,
        });
      }

      return state.cache.launchesByFamily;
    },

    launchesByRocket: (state) => {
      if (state.isDirty && state.isReady) {
        state.isReady = false;

        worker.addEventListener('message', (result) => {
          state.cache = result.data;
          state.isReady = true;
          state.isDirty = false;
        }, { once: true });

        worker.postMessage({
          cmd: 'processRaw',
          raw: state.raw,
          filterInto: state.filter,
        });
      }

      return state.cache.launchesByRocket;
    },

    launchCountByRocket: (state) => {
      if (state.isDirty && state.isReady) {
        state.isReady = false;

        worker.addEventListener('message', (result) => {
          state.cache = result.data;
          state.isReady = true;
          state.isDirty = false;
        }, { once: true });

        worker.postMessage({
          cmd: 'processRaw',
          raw: state.raw,
          filterInto: state.filter,
        });
      }

      return state.cache.launchCountByRocket;
    },

    mediaByLaunch: (state) => {
      if (state.isDirty && state.isReady) {
        state.isReady = false;

        worker.addEventListener('message', (result) => {
          state.cache = result.data;
          state.isReady = true;
          state.isDirty = false;
        }, { once: true });

        worker.postMessage({
          cmd: 'processRaw',
          raw: state.raw,
          filterInto: state.filter,
        });
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
