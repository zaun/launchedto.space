/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import { readFile, writeFile } from 'fs';
import { encodeFromFile } from 'image-data-uri';
import { filter, find, findIndex, map, remove, sortBy } from 'lodash';
import path from 'path';
import uuidv4 from 'uuid/v4';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    launches: [],
    families: [],
    media: [],
    imageData: {},
    orbitOptions: [
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
    ],
  },

  mutations: {
    addLaunchMedia(state, data) {
      encodeFromFile(path.join(__dirname, '../../../../media/thumb/', data.filename)).then((uri) => {
        // eslint-disable-next-line
        console.log('Loaded: ' + data.filename);
        Vue.set(state.imageData, data.id, uri);
      });
    },

    addRocketFamily(state, data) {
      const found = find(state.families, { id: data.id });

      if (!found) {
        state.families.push(data);
      }
    },

    addRocketImage(state, data) {
      encodeFromFile(path.join(__dirname, '../../../../media/vehicles_icon/', data.name)).then((uri) => {
        // eslint-disable-next-line
        console.log('Loaded: ' + data.name);
        Vue.set(state.imageData, data.id, uri);
      });
    },

    addRocketIcon(state, data) {
      encodeFromFile(path.join(__dirname, '../../../../media/vehicles/', data.name)).then((uri) => {
        // eslint-disable-next-line
        console.log('Loaded: ' + data.name);
        Vue.set(state.imageData, `${data.id}-icon`, uri);
      });
    },

    deleteLaunchMedia(state, data) {
      const idx = findIndex(state.media, data);
      Vue.delete(state.media, idx);
    },

    defaultLaunchMedia(state, data) {
      const m = find(state.media, { id: data.id });
      if (data.default === true) {
        m.default = true;
      } else {
        delete m.default;
      }
    },

    saveMedia(state, data) {
      data.forEach((i) => {
        const m = find(state.media, { id: i.id });
        if (m) {
          m.description = i.description;
        } else {
          state.media.push({
            id: i.id,
            launchID: i.launchID,
            filename: i.filename,
            description: i.description,
          });
        }
      });
      state.media = sortBy(state.media, 'id');
      writeFile(path.join(__dirname, '../../../../data/media.json'), JSON.stringify(state.media, null, 2));
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

          let f = find(state.families, { name: i.vehicleFamily });
          if (f) {
            i.vehicleFamily = f.id;
          }
          f = find(state.families, { id: i.vehicleFamily });

          const r = find(f.rockets, { name: i.vehicle });
          if (r) {
            i.vehicle = r.id;
          }

          return i;
        });
      });
    },

    updateMediaData(state) {
      readFile(path.join(__dirname, '../../../../data/media.json'), (err, data) => {
        state.media = JSON.parse(data.toString());

        state.media.forEach((m) => {
          m.id = m.id ? m.id : uuidv4();
          encodeFromFile(path.join(__dirname, '../../../../media/thumb/', m.filename)).then((uri) => {
            // eslint-disable-next-line
            console.log('Loaded: ' + m.filename);
            Vue.set(state.imageData, m.id, uri);
          });
        });
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

            if (r.rocketImage) {
              encodeFromFile(path.join(__dirname, '../../../../media/vehicles/', r.rocketImage)).then((uri) => {
                // eslint-disable-next-line
                console.log('Loaded: ' + r.rocketImage);
                state.imageData[r.id] = uri;
              });
            }

            if (r.rocketIcon) {
              encodeFromFile(path.join(__dirname, '../../../../media/vehicles_icon/', r.rocketIcon)).then((uri) => {
                // eslint-disable-next-line
                console.log('Loaded: ' + r.rocketIcon);
                state.imageData[`${r.id}-icon`] = uri;
              });
            }

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
    addLaunchMedia(context, data) {
      context.commit('addLaunchMedia', data);
    },

    addRocketFamily(context, data) {
      context.commit('addRocketFamily', data);
    },

    addRocketImage(context, data) {
      context.commit('addRocketImage', data);
    },

    addRocketIcon(context, data) {
      context.commit('addRocketIcon', data);
    },

    deleteLaunchMedia(context, data) {
      context.commit('deleteLaunchMedia', data);
    },

    defaultLaunchMedia(context, data) {
      context.commit('defaultLaunchMedia', data);
    },

    updateData(context) {
      context.commit('updateMediaData');
      context.commit('updateFamilies');
      setTimeout(() => {
        context.commit('updateLaunchData');
      }, 100);
    },

    saveLaunch(context, data) {
      context.commit('saveLaunch', data);
    },

    saveMedia(context, data) {
      context.commit('saveMedia', data);
    },

    saveRocket(context, data) {
      context.commit('saveRocket', data);
    },
  },
});
