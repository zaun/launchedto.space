/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import { readFile, writeFile } from 'fs';
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
      'GTO',
      'SSO',
      'TLI',
      'IP',
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
      writeFile(path.join(__dirname, '../../../../data/launches.json'), JSON.stringify(state.launches, null, 2));
    },

    saveRocket(state, data) {
      const family = find(state.families, { name: data.family });

      if (family) {
        const rocket = find(family.rockets, { id: data.rocket.id });
        if (rocket) {
          remove(family.rockets, { id: data.rocket.id });
        }
        family.rockets.push(data.rocket);
        family.rockets = sortBy(family.rockets, 'name');

        writeFile(path.join(__dirname, '../../../../data/families.json'), JSON.stringify(state.families, null, 2));
      } else {
        // eslint-disable-next-line
        console.log('Can\'t find family ' + data.family);
      }
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

            if (!r.payloadType) {
              if (r.fairingHeight || r.fairingDiameter) {
                r.payloadType = 'Fairing';
              } else if (r.capsuleHeight || r.capsuleDiameter) {
                r.payloadType = 'Capsule';
              } else {
                r.payloadType = 'Fairing';
              }
            }

            r.expendable = r.expendable ? r.expendable : 'yes';

            Object.keys(r).forEach((prop) => {
              if (r[prop] === -1) {
                delete r[prop];
              }
            });

            r.stages = r.stages ? r.stages : [];
            r.stages.forEach((s) => {
              Object.keys(s).forEach((prop) => {
                if (s[prop] === -1) {
                  delete s[prop];
                }
              });
            });

            return r;
          });

          return f;
        });
      });
    },

    writeLaunchData(state) {
      writeFile(path.join(__dirname, '../../../../data/launches.json'), JSON.stringify(state.launches, null, 2));
    },

    writeFamiliesData(state) {
      writeFile(path.join(__dirname, '../../../../data/families.json'), JSON.stringify(state.families, null, 2));
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

    saveRocket(context, data) {
      context.commit('saveRocket', data);
    },
  },
});
