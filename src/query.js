import { round } from './math';

// Keys that should be encoded/decoded as arrays
const jsonKeys = ['maps'];

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

function fromQueryString(qs) {
  const paramString = qs.split('#')[1];
  if (!paramString) return {};
  let params = Object.fromEntries(
    paramString.split('&').map(e => e.split('=').map(decodeURIComponent))
  );
  if (params.map) {
    const [zoom, lat, lng, pitch, bearing] = params.map.split('/');
    params = {
      ...params,
      bearing,
      lat,
      lng,
      pitch,
      zoom,
    };
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
      .filter(([k, v]) => !mapLocationKeys.includes(k))
      .map(([k, v]) => [k, jsonKeys.includes(k) ? JSON.stringify(v) : v])
  );

  nonMapSettings = cleanSettings(nonMapSettings);

  return toQueryString({
    map: [
      round(newMapSettings.zoom, 2),
      round(newMapSettings.center.lat, 4),
      round(newMapSettings.center.lng, 4),
      round(newMapSettings.pitch, 1),
      round(newMapSettings.bearing, 1),
    ].join('/'),
    ...nonMapSettings,
  });
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

  // Only return center, not lat and lng
  if (urlState.lat && urlState.lng) {
    const { lat, lng } = urlState;
    urlState.center = { lat, lng };
    delete urlState.lat;
    delete urlState.lng;
  }

  // map is redundant here, remove it
  if (urlState.map) {
    delete urlState.map;
  }

  return urlState;
}
