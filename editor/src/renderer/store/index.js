/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import { readFile } from 'fs';
import { filter, find, map, remove, sortBy } from 'lodash';
import path from 'path';
import uuidv4 from 'uuid/v4';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    launches: [],
    families: [],
    media: [],
    orbitOptions: [
      'Karmen',
      'LEO',
      'LPEO',
      'MEO',
      'GEO',
      'TLI',
    ],
  },

  mutations: {
    addRocketFamily(state, data) {
      const found = find(state.families, { id: data.id });

      if (!found) {
        state.families.push(data);
      }
    },

    saveLaunch(state, data) {
      const found = find(state.launches, { id: data.id });

      if (found) {
        remove(state.launches, { id: data.id });
      }
      state.launches.push(data);
      state.launches = sortBy(state.launches, 'date');
    },

    updateLaunchData(state) {
      readFile(path.join(__dirname, '../../../../data/launches.json'), (err, data) => {
        state.launches = map(filter(sortBy(JSON.parse(data.toString()), 'date'), 'date'), (i) => {
          i.id = i.id ? i.id : uuidv4();
          if (i.status) {
            i.status = i.status.toLowerCase();
          }
          if (i.manned) {
            i.manned = i.manned.toLowerCase();
          }
          if (i.orbital) {
            i.orbital = i.orbital.toLowerCase();
          }

          switch (i.launchSite) {
            case 'NASA John F. Kennedy Space Center':
              i.launchSite = 'Kennedy Space Center';
              break;
            default:
          }

          i.payloads = map(i.payloads, (p) => {
            p.id = p.id ? p.id : uuidv4();
            p.status = p.status ? p.status : i.status;
            return p;
          });

          return i;
        });
      });
    },

    updateMediaData(state) {
      readFile(path.join(__dirname, '../../../../data/media.json'), (err, data) => {
        state.media = JSON.parse(data.toString());
      });
    },

    updateFamilies(state) {
      readFile(path.join(__dirname, '../../../../data/families.json'), (err, data) => {
        state.families = map(JSON.parse(data.toString()), (f) => {
          f.id = f.id ? f.id : uuidv4();

          f.rockets = map(f.rockets, (r) => {
            r.id = r.id ? r.id : uuidv4();
            return r;
          });

          return f;
        });
      });
    },
  },

  actions: {
    addRocketFamily(context, data) {
      context.commit('addRocketFamily', data);
    },

    updateData(context) {
      context.commit('updateLaunchData');
      context.commit('updateMediaData');
      context.commit('updateFamilies');
    },

    saveLaunch(context, data) {
      context.commit('saveLaunch', data);
    },
  },
});
