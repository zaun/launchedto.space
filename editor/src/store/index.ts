import { reactive } from '@vue/composition-api';
import { promises as fs } from 'fs';
import {
  assign,
  filter,
  find,
  findIndex,
} from 'lodash';
import path from 'path';
import uuidv4 from 'uuid/v4';

const DATA_PATH = path.join(__dirname, '../../../../../../../../../data/');

const _ = {
  assign,
  filter,
  find,
  findIndex,
};

interface Astronaut {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nationality: string;
  almamaters: Array<{
    name: string;
    year: string;
    degree: string;
    fieldOfStudy: string;
  }>;
  missions: Array<{
    name: string;
  }>;
}

interface Launch {
  id: string;
  orbital: string | boolean;
  payloads: Array<{
    name: string;
    orbital: string | boolean;
  }>;
}

interface Media {
  id: string;
  launchID: string;
  filename: string;
  description: string;
  default: boolean;
}

interface Rocket {
  id: string;
  name: string;
}

interface RocketFamily {
  id: string;
  rockets: Array<Rocket>;
}

const { readFile, writeFile } = fs;

let appState: {
  astronauts: Array<Astronaut>;
  launches: Array<Launch>;
  media: Array<Media>;
  rockets: Array<RocketFamily>;
} = {
  astronauts: [],
  launches: [],
  media: [],
  rockets: [],
};

const init = () => {
  appState = reactive({
    astronauts: [],
    launches: [],
    media: [],
    rockets: [],
  });
};

const mutations = {
  loadAll() {
    return mutations.loadAstronautData()
      .then(() => mutations.loadLaunchData())
      .then(() => mutations.loadRocketsData())
      .then(() => mutations.loadMediaData());
  },
  output() {
    return writeFile(path.join(DATA_PATH, 'astronauts.json'), JSON.stringify(appState.astronauts, null, 2))
      .then(() => writeFile(path.join(DATA_PATH, 'launches.json'), JSON.stringify(appState.launches, null, 2)));
  },
  loadAstronautData() {
    return readFile(path.join(DATA_PATH, 'astronauts.json'))
      .then((data) => {
        const astronauts = JSON.parse(data.toString());
        appState.astronauts.length = 0;
        astronauts.forEach((i: Astronaut) => {
          const astro = i;
          astro.id = i.id ? i.id : uuidv4();
          astro.almamaters = i.almamaters ? i.almamaters : [];
          astro.missions = i.missions ? i.missions : [];
          appState.astronauts.push(astro);
        });
      });
  },
  loadLaunchData() {
    return readFile(path.join(DATA_PATH, 'launches.json'))
      .then((data) => {
        const launches = JSON.parse(data.toString());
        appState.launches.length = 0;
        launches.forEach((i: Launch) => {
          const launch = i;
          launch.id = i.id ? i.id : uuidv4();

          launch.orbital = launch.orbital === 'yes';
          const count = launch.payloads.length;
          for (let idx = 0; idx < count; idx += 1) {
            launch.payloads[idx].orbital = launch.payloads[idx].orbital === 'yes';
          }

          appState.launches.push(launch);
        });
      });
  },
  loadMediaData() {
    return readFile(path.join(DATA_PATH, 'media.json'))
      .then((data) => {
        const media = JSON.parse(data.toString());
        appState.media.length = 0;
        media.forEach((m: Media) => {
          const img = m;
          img.id = m.id ? m.id : uuidv4();
          img.default = m.default === true;
          appState.media.push(img);
        });
      });
  },
  loadRocketsData() {
    return readFile(path.join(DATA_PATH, 'families.json'))
      .then((data) => {
        const rockets = JSON.parse(data.toString());
        appState.rockets.length = 0;
        rockets.forEach((i: RocketFamily) => {
          const rocketFamily = i;
          rocketFamily.id = i.id ? i.id : uuidv4();
          rocketFamily.rockets.forEach((r: Rocket) => {
            const rocket = r;
            rocket.id = r.id ? r.id : uuidv4();
          });
          appState.rockets.push(rocketFamily);
        });
      });
  },

  saveAstronaut(astronaut: Astronaut) {
    const found = _.find(appState.astronauts, { id: astronaut.id });
    let id;
    if (found) {
      _.assign(found, astronaut);
      ({ id } = found);
    } else {
      const astro = astronaut;
      astro.id = uuidv4();
      appState.astronauts.push(astro);
      ({ id } = astro);
    }
    return mutations.output();
  },
  deleteAstronaut(astronaut: Astronaut) {
    const idx = _.findIndex(appState.astronauts, { id: astronaut.id });
    if (idx > -1) {
      appState.astronauts.splice(idx, 1);
    }
    return mutations.output();
  },

  saveLaunch(launch: Launch) {
    const found = _.find(appState.launches, { id: launch.id });
    let id: string;
    if (found) {
      _.assign(found, launch);
      ({ id } = found);
    } else {
      const l = launch;
      l.id = uuidv4();
      appState.launches.push(l);
      ({ id } = l);
    }
    return mutations.output().then(() => id);
  },
  deleteLaunch(launch: Launch) {
    const idx = _.findIndex(appState.astronauts, { id: launch.id });
    if (idx > -1) {
      appState.launches.splice(idx, 1);
    }
    return mutations.output();
  },

  saveRocketFamily(family: RocketFamily) {
    const found = _.find(appState.rockets, { id: family.id });
    let id: string;
    if (found) {
      _.assign(found, family);
      ({ id } = found);
    } else {
      const f = family;
      f.id = uuidv4();
      appState.rockets.push(f);
      ({ id } = f);
    }
    return mutations.output().then(() => id);
  },
  saveRocket(family: RocketFamily, rocket: Rocket) {
    const fam = _.find(appState.rockets, { id: family.id });
    let id: string;
    if (fam) {
      const found = _.find(fam.rockets, { id: rocket.id });
      if (found) {
        _.assign(found, rocket);
        ({ id } = found);
      } else {
        const r = rocket;
        r.id = uuidv4();
        fam.rockets.push(r);
      }
    }
    return mutations.output().then(() => id);
  },
  deleteRocket(family: RocketFamily, rocket: Rocket) {
    const fam = _.find(appState.rockets, { id: family.id });
    if (fam) {
      const idx = _.findIndex(fam.rockets, { id: rocket.id });
      if (idx > -1) {
        fam.rockets.splice(idx, 1);
      }
    }
    return mutations.output();
  },
};

const getters = {
  astronauts: () => appState.astronauts,
  astronaut: (id: string) => _.find(appState.astronauts, { id }),
  launches: () => appState.launches,
  launch: (id: string) => _.find(appState.launches, { id }),
  launchMedia: (id: string) => _.filter(appState.media, { launchID: id }) || [],
  rockets: () => appState.rockets,
  rocket: (fam: string, id: string) => {
    const found = _.find(appState.rockets, { id: fam });
    if (found) {
      return _.find(found.rockets, { id });
    }
    return null;
  },
  rocketFamily: (fam: string) => _.find(appState.rockets, { id: fam }),
};

export default {
  init,
  mutations,
  getters,
};
