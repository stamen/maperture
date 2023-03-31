import { config as configStore } from './stores';
import { isMapboxUrl, normalizeMapboxUrl } from './mapbox-urls';

let mapboxGlAccessToken;
let alterIncomingStyle;
configStore.subscribe(
  value => ({ mapboxGlAccessToken, alterIncomingStyle } = value)
);

const fetchUrl = async url => {
  const urlIsMapbox = isMapboxUrl(url);
  let nextUrl = url;
  if (urlIsMapbox) {
    nextUrl = normalizeMapboxUrl(url, mapboxGlAccessToken);
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

  let data = await response.json();
  // Special handling to error on Mapbox style url since it can return successfully with an error
  if (urlIsMapbox && data.message) {
    throw { message: data.message };
  }

  if (alterIncomingStyle) {
    data = alterIncomingStyle(data);
  }

  return data;
};

export { fetchUrl };
