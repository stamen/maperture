import { mapboxGlAccessToken } from './config';

const isMapboxUrl = url => {
  if (typeof url !== 'string') return false;
  const hasMapboxFormat =
    url.startsWith('mapbox://styles/') && url.split('/').length === 5;
  return hasMapboxFormat;
};

const fetchUrl = async function (url) {
  const urlIsMapbox = isMapboxUrl(url);
  let nextUrl = url;
  if (urlIsMapbox) {
    const [, , , userName, styleId] = nextUrl.split('/');
    nextUrl = `https://api.mapbox.com/styles/v1/${userName}/${styleId}?title=true&access_token=${mapboxGlAccessToken}`;
  }
  if (nextUrl.includes('localhost')) {
    const [preface, address] = nextUrl.split('localhost');
    // Fetch doesn't accept localhost unless prefaced with http://
    // This adds the preface if not present
    if (!preface) {
      nextUrl = `http://localhost${address}`;
    }
  }
  const response = await fetch(nextUrl);

  const data = await response.json();
  // Special handling to error on Mapbox style url since it returns successfully with an error
  if (urlIsMapbox && data.message) throw new Error(data.message);
  return data;
};

export { fetchUrl, isMapboxUrl };
