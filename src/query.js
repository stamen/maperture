import { round } from './math';

function toQueryString(obj) {
  let qs = obj.map ? `map=${obj.map}` : '';

  Object.entries(obj).forEach(([key, value], i) => {
    if (key === 'map') return;
    let encodedValue = encodeURIComponent(value);
    qs = `${qs}${qs !== '' ? '&' : ''}${key}=${encodedValue}`;
  });
  return qs;
}

function fromQueryString(qs) {
  const paramString = qs.split('#')[1];
  if (!paramString) return {};
  let params = Object.fromEntries(paramString.split('&').map(e => e.split('=').map(decodeURIComponent)));
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

export function writeHash(mapSettings) {
  const arrayKeys = ['names', 'styles', 'watches'];
  const mapLocationKeys = ['bearing', 'center', 'pitch', 'zoom'];
  const nonMapSettings = Object.fromEntries(
    Object.entries(mapSettings)
	  .filter(([k, v]) => !mapLocationKeys.includes(k))
	  .map(([k, v]) => [k, arrayKeys.includes(k) ? JSON.stringify(v) : v])
  );
  window.location.hash = toQueryString({
    map: [
      round(mapSettings.zoom, 2),
      round(mapSettings.center.lat, 4),
      round(mapSettings.center.lng, 4),
      round(mapSettings.pitch, 1),
      round(mapSettings.bearing, 1),
    ].join('/'),
    ...nonMapSettings
  });
}

export function readHash(qs) {
  const urlState = fromQueryString(qs);
  return {
    ...urlState,
	names: urlState.names ? JSON.parse(urlState.names) : null,
	styles: urlState.styles ? JSON.parse(urlState.styles) : null,
	watches: urlState.watches ? JSON.parse(urlState.watches) : null,
    bearing: +urlState.bearing,
    lat: +urlState.lat,
    lng: +urlState.lng,
    pitch: +urlState.pitch,
    zoom: +urlState.zoom,
  };
}
