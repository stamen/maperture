import { config as configStore } from './stores';
import { isMapboxUrl, normalizeMapboxUrl } from './mapbox-urls';
import { normalizeMapTilerUrl } from './maptiler-urls';

let mapboxGlAccessToken, maptilerApiKey;
configStore.subscribe(
  value => ({ mapboxGlAccessToken, maptilerApiKey } = value)
);

const fetchUrl = async url => {
  const urlIsMapbox = isMapboxUrl(url);
  let nextUrl = new URL(url);
  if (urlIsMapbox) {
    nextUrl = normalizeMapboxUrl(nextUrl.toString(), mapboxGlAccessToken);
  } else if (nextUrl.host === 'api.maptiler.com') {
    nextUrl = normalizeMapTilerUrl(nextUrl, maptilerApiKey);
  }
  let response;
  try {
    response = await fetch(nextUrl);
  } catch (err) {
    throw { message: err.message };
  }

  if (!response.ok) {
    throw { status: response.status, message: response.statusText };
  }

  const data = await response.json();
  // Special handling to error on Mapbox style url since it can return successfully with an error
  if (urlIsMapbox && data.message) {
    throw { message: data.message };
  }
  return data;
};

export { fetchUrl };
