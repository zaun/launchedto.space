importScripts('//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js');

const updateCacheWorker = (raw, filterInfo) => {
  const cache = {};

  // Launch data
  const sortedDataL = _.sortBy(_.filter(raw.launches, l => l.date.length > 0), 'date');
  const cleanDataL = _.map(sortedDataL, (l) => {
    l.payloads = l.payloads ? l.payloads : [];
    l.payloads = _.map(l.payloads, (p) => {
      p.status = p.status ? p.status : l.status;
      return p;
    });

    return l;
  });
  const filteredDataL = _.filter(cleanDataL, (l) => {
    const found = _.includes(filterInfo.families, l.vehicleFamily);
    return found || filterInfo.families.length === 0;
  });
  cache.launchesByYear = _.groupBy(filteredDataL, l => l.date.split('-')[0]);
  cache.launchesByFamily = _.groupBy(filteredDataL, l => l.vehicleFamily);
  cache.launchesByRocket = _.groupBy(filteredDataL, l => l.vehicle);
  cache.launchCountByRocket = _.countBy(filteredDataL, l => l.vehicle);

  // Rocket Family data
  const filteredDataF = _.filter(raw.families, (f) => {
    const found = _.includes(filterInfo.families, f.id);
    return found || filterInfo.families.length === 0;
  });
  cache.storedFamilies = _.sortBy(filteredDataF, 'name');
  cache.familyOptions = _.map(raw.families, f => ({
    value: f.id,
    text: f.name,
  }));

  // Media
  const filteredDataM = _.filter(raw.media, m => m.launchID.length > 0);
  cache.mediaByLaunch = _.groupBy(filteredDataM, m => m.launchID);

  postMessage(cache);
};

this.addEventListener('message', (e) => {
  const data = e.data;
  switch (data.cmd) {
    case 'processRaw':
      updateCacheWorker(data.raw, data.filterInfo);
      break;
    default:
      break;
  };
}, false);
