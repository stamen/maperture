import { config as configStore } from './stores';
import { isMapboxUrl, normalizeMapboxUrl } from './mapbox-urls';

let mapboxGlAccessToken, maptilerApiKey;
configStore.subscribe(
  value => ({ mapboxGlAccessToken, maptilerApiKey } = value)
);

const fetchUrl = async url => {
  const urlIsMapbox = isMapboxUrl(url);
  let nextUrl = url;
  if (urlIsMapbox) {
    nextUrl = normalizeMapboxUrl(url, mapboxGlAccessToken);
  } else if (
    maptilerApiKey &&
    (url.startsWith('https://api.maptiler.com') || !url.startsWith('http'))
  ) {
    const maptilersdk = await import('@maptiler/sdk');
    nextUrl = `${maptilersdk.expandMapStyle(url)}?key=${maptilerApiKey}`;
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
