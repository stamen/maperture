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
  const response = await fetch(nextUrl);

  const data = await response.json();
  // Special handling to error on Mapbox style url since it returns successfully with an error
  if (urlIsMapbox && data.message) throw new Error(data.message);
  return data;
};

export { fetchUrl };
