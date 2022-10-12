import { round } from './math';
import { linkLocations as linkLocationsStore } from './stores';

let linkedLocations;
linkLocationsStore.subscribe(value => (linkedLocations = value));

// Keys that should be encoded/decoded as arrays
const jsonKeys = ['maps', 'locations'];

// Keys that should be encoded/decoded as boolean values
const booleanKeys = ['showCollisions', 'showBoundaries'];

// Keys that should be encoded (not decoded) encoded as one map param
const mapLocationKeys = ['bearing', 'center', 'pitch', 'zoom'];

// Keys that should be decoded as numbers
const numericKeys = ['bearing', 'lat', 'lng', 'pitch', 'zoom'];

function toQueryString(obj) {
  let qs = obj.map ? `map=${obj.map}` : '';
  const excludedKeys = ['map', 'stylePresets'];

  Object.entries(obj).forEach(([key, value], i) => {
    if (excludedKeys.includes(key)) return;
    let encodedValue = encodeURIComponent(value);
    qs = `${qs}${qs !== '' ? '&' : ''}${key}=${encodedValue}`;
  });
  return qs;
}

const encodeMapParams = ({ zoom, center, pitch, bearing }) => {
  return [
    round(zoom, 2),
    round(center.lat, 4),
    round(center.lng, 4),
    round(pitch ?? 0, 1),
    round(bearing ?? 0, 1),
  ].join('/');
};

const decodeMapParams = mapStr => {
  const [zoom, lat, lng, pitch, bearing] = mapStr.split('/');
  return {
    bearing,
    center: { lat, lng },
    pitch,
    zoom,
  };
};

function fromQueryString(qs) {
  const paramString = qs.split('#')[1];
  if (!paramString) return {};
  let params = Object.fromEntries(
    paramString.split('&').map(e => e.split('=').map(decodeURIComponent))
  );
  if (params.map) {
    params = {
      ...params,
      ...decodeMapParams(params.map),
    };
  }
  if (params.locations) {
    params.locations = JSON.stringify(
      JSON.parse(params.locations).map(item => ({
        ...item,
        location: decodeMapParams(item.location),
      }))
    );
  }
  return params;
}

// Remove values set to null
const cleanSettings = stateObj => {
  let nextState = Object.keys(stateObj).reduce((acc, k) => {
    const value = stateObj[k];
    if (value !== null) acc[k] = value;
    return acc;
  }, {});
  return nextState;
};

export function createHashString(mapSettings) {
  let newMapSettings = JSON.parse(JSON.stringify(mapSettings));
  if (newMapSettings.maps?.length ?? 0) {
    const newMaps = newMapSettings.maps;

    // Remove map styles before hashing
    newMapSettings.maps = newMaps.map(m => {
      delete m.style;
      return m;
    });
  }

  let nonMapSettings = Object.fromEntries(
    Object.entries(newMapSettings)
      .filter(([k, v]) => !mapLocationKeys.includes(k) && k !== 'locations')
      .map(([k, v]) => [k, jsonKeys.includes(k) ? JSON.stringify(v) : v])
  );

  nonMapSettings = cleanSettings(nonMapSettings);

  let updatedSettings = {
    ...nonMapSettings,
  };

  if (linkedLocations) {
    updatedSettings = {
      map: encodeMapParams(newMapSettings),
      ...updatedSettings,
    };
  } else {
    updatedSettings = {
      locations: JSON.stringify(
        newMapSettings.locations.map(item => ({
          ...item,
          location: encodeMapParams(item.location),
        }))
      ),
      ...updatedSettings,
    };
  }

  return toQueryString(updatedSettings);
}

export function writeHash(mapSettings) {
  window.location.hash = createHashString(mapSettings);
}

export function readHash(qs) {
  // Remove unset values, convert value as necessary
  let urlState = Object.fromEntries(
    Object.entries(fromQueryString(qs))
      .filter(([k, v]) => !!v)
      .map(([k, v]) => {
        if (jsonKeys.includes(k)) return [k, JSON.parse(v)];
        if (booleanKeys.includes(k)) return [k, v === 'true'];
        if (numericKeys.includes(k)) return [k, +v || 0];
        return [k, v];
      })
  );

  // map is redundant here, remove it
  if (urlState.map) {
    delete urlState.map;
  }

  return urlState;
}
