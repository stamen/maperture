import { config as configStore } from './stores';

let mapboxGlAccessToken;
configStore.subscribe(value => ({ mapboxGlAccessToken } = value));

const isMapboxUrl = url => {
  if (typeof url !== 'string') return false;
  const hasMapboxFormat =
    url.startsWith('mapbox://styles/') && url.split('/').length === 5;
  return hasMapboxFormat;
};

const fetchUrl = async url => {
  const urlIsMapbox = isMapboxUrl(url);
  let nextUrl = url;
  if (urlIsMapbox) {
    const [, , , userName, styleId] = nextUrl.split('/');
    nextUrl = `https://api.mapbox.com/styles/v1/${userName}/${styleId}?title=true&access_token=${mapboxGlAccessToken}`;
  }
  let response;
  try {
    response = await fetch(nextUrl);
  } catch (err) {
    throw { status: err.status, message: err.message };
  }

  if (!response.ok) {
    throw { status: response.status, message: response.statusText };
  }

  const data = await response.json();
  // Special handling to error on Mapbox style url since it returns successfully with an error
  if (urlIsMapbox && data.message) throw { message: data.message };
  return data;
};

export { fetchUrl };
