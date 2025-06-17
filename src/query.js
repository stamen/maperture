import isEqual from 'lodash.isequal';
import { round } from './math';
import { linkLocations as linkLocationsStore } from './stores';
import { createBranchUrl } from './branch-utils';

let linkedLocations;
linkLocationsStore.subscribe(value => (linkedLocations = value));

// Keys that should be encoded/decoded as arrays
const jsonKeys = ['locations'];

// Keys that should be encoded/decoded as boolean values
const booleanKeys = ['showCollisions', 'showBoundaries', 'showDiff'];

// Keys that should be encoded (not decoded) encoded as one map param
const mapLocationKeys = ['bearing', 'center', 'pitch', 'zoom'];

// Keys that should be decoded as numbers
const numericKeys = ['bearing', 'lat', 'lng', 'pitch', 'zoom'];

// These keys are excluded from settings either because of special handling or not being part of the hash
const excludedKeysFromSettings = ['map', 'stylePresets'];

function toQueryString(obj) {
  let qs = obj.map ? `map=${obj.map}` : '';

  Object.entries(obj).forEach(([key, value], i) => {
    if (excludedKeysFromSettings.includes(key)) return;
    let encodedValue = encodeURIComponent(value);
    qs = `${qs}${qs !== '' ? '&' : ''}${key}=${encodedValue}`;
  });
  return qs;
}

const findStylePreset = (id, stylePresets) => {
  const flatPresets = [
    ...stylePresets.filter(p => p.type !== 'sublist'),
    ...stylePresets.filter(p => p.type === 'sublist').flatMap(p => p.presets),
  ];

  return flatPresets.find(preset => preset.id === id);
};

const findBranchPattern = (map, branchPatterns) => {
  const branchPattern = branchPatterns.find(p => p.id === map.branchPatternId);
  if (!branchPattern) return null;
  return {
    ...branchPattern,
    url: createBranchUrl(
      branchPattern.pattern,
      map.branch,
      map.branchPatternStyle
    ),
  };
};

const encodeMaps = (maps, config) => {
  const mapsToEncode = maps.map(m => {
    let encodeMap = { id: m.id };
    let configMap;

    if (m.branchPatternId) {
      configMap = findBranchPattern(m, config.branchPatterns);
      encodeMap = {
        branchPatternId: configMap.id,
        branchPatternStyle: m.branchPatternStyle,
        branch: m.branch,
      };
    } else {
      configMap = findStylePreset(m.id, config.stylePresets);
    }

    if (!configMap) return m;

    // Only renderer if not default
    if (m.renderer !== configMap.renderer) {
      encodeMap.renderer = m.renderer;
    }

    return encodeMap;
  });

  return JSON.stringify(mapsToEncode);
};

const decodeMaps = (str, config) => {
  const maps = JSON.parse(str);
  const decodedMaps = maps
    .map(m => {
      let configMap = findStylePreset(m.id, config.stylePresets);
      if (!configMap) configMap = findBranchPattern(m, config.branchPatterns);
      if (!configMap) return m;
      return { ...configMap, ...m };
    })
    .filter(v => v);
  return decodedMaps;
};

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
      JSON.parse(params.locations).map(location => decodeMapParams(location))
    );
  }
  return params;
}

// Remove values set to null / false
const cleanSettings = stateObj => {
  let nextState = Object.keys(stateObj).reduce((acc, k) => {
    const value = stateObj[k];
    // Only include booleanKeys if not default
    if (booleanKeys.includes(k) && !value) return acc;
    if (value !== null) acc[k] = value;
    return acc;
  }, {});
  return nextState;
};

export const createHashString = (mapSettings, config) => {
  let nonMapSettings = Object.fromEntries(
    Object.entries(mapSettings)
      .filter(([k, v]) => !mapLocationKeys.includes(k) && k !== 'locations')
      .map(([k, v]) => {
        let encodedValue = v;
        if (k === 'maps') encodedValue = encodeMaps(v, config);
        else if (jsonKeys.includes(k)) encodedValue = JSON.stringify(v);
        return [k, encodedValue];
      })
  );

  nonMapSettings = cleanSettings(nonMapSettings);

  const currentHash = readHash(window.location.hash, config);

  const requiresHistoryItem = Object.entries(nonMapSettings).some(kv => {
    let [k, v] = kv;
    if (excludedKeysFromSettings.includes(k)) return false;

    try {
      v = JSON.parse(v);
    } catch (e) {}

    return !isEqual(v, currentHash?.[k]);
  });

  let updatedSettings = {
    ...nonMapSettings,
  };

  if (linkedLocations) {
    updatedSettings = {
      map: encodeMapParams(mapSettings),
      ...updatedSettings,
    };
  } else {
    updatedSettings = {
      locations: JSON.stringify(
        mapSettings.locations.map(location => encodeMapParams(location))
      ),
      ...updatedSettings,
    };
  }

  const nextHash = toQueryString(updatedSettings);

  return { nextHash, requiresHistoryItem };
};

export function writeHash(mapSettings, config) {
  const { nextHash, requiresHistoryItem } = createHashString(
    mapSettings,
    config
  );
  if (!requiresHistoryItem) {
    window.location.replace(`${window.location.pathname}#${nextHash}`);
  } else {
    window.location.hash = nextHash;
  }
}

export function readHash(qs, config) {
  // Remove unset values, convert value as necessary
  let urlState = Object.fromEntries(
    Object.entries(fromQueryString(qs))
      .filter(([k, v]) => !!v)
      .map(([k, v]) => {
        if (k === 'maps') return [k, decodeMaps(v, config)];
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
