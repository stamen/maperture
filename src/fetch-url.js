import { mapboxGlAccessToken } from './config';

const isMapboxUrl = url => {
  if (typeof url !== 'string') return false;
  const hasMapboxFormat =
    url.startsWith('mapbox://styles/') && url.split('/').length === 5;
  return hasMapboxFormat;
};

const fetchUrl = url => {
  const urlIsMapbox = isMapboxUrl(url);
  let nextUrl = url;
  if (urlIsMapbox) {
    const [, , , userName, styleId] = nextUrl.split('/');
    nextUrl = `https://api.mapbox.com/styles/v1/${userName}/${styleId}?title=true&access_token=${mapboxGlAccessToken}`;
  }
  return fetch(nextUrl).then(response => {
    const data = response.json();
    return data.then(d => {
      // Special handling to error on Mapbox style url since it returns successfully with an error
      if (urlIsMapbox && d.message) throw new Error(d.message);
      return d;
    });
  });
};

export { fetchUrl };
