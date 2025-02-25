/*
 * Detect a mapbox:// style url
 */
export const isMapboxUrl = url => {
  if (typeof url !== 'string') return false;
  const hasMapboxProtocol = url.startsWith('mapbox://');
  return hasMapboxProtocol;
};

/*
 * Convert a mapbox:// URL to an https:// URL
 */
export const normalizeMapboxUrl = (url, accessToken) => {
  if (!isMapboxUrl(url)) return url;
  if (!accessToken) return url;
  const [, , , userName, styleId] = url.split('/');
  return `https://api.mapbox.com/styles/v1/${userName}/${styleId}?title=true&access_token=${accessToken}`;
};

export const isMaptilerUrl = url => {
  if (!url) return false;
  let nextUrl = new URL(url);
  return (
    nextUrl.host === 'api.maptiler.com' && !nextUrl.searchParams.has('key')
  );
};

/*
 * Add key to MapTiler url if it is missing
 */
export const normalizeMapTilerUrl = (url, maptilerApiKey) => {
  if (!maptilerApiKey) return url;
  let nextUrl = new URL(url);
  if (maptilerApiKey && isMaptilerUrl(url)) {
    nextUrl.searchParams.append('key', maptilerApiKey);
  }
  return nextUrl.toString();
};

export const normalizeUrl = (url, keys) => {
  const { mapboxKey, maptilerKey } = keys;
  let nextUrl = url;
  if (isMapboxUrl(url) && mapboxKey) {
    nextUrl = normalizeMapboxUrl(nextUrl, mapboxKey);
  } else if (isMaptilerUrl(url) && maptilerKey) {
    nextUrl = normalizeMapTilerUrl(nextUrl, maptilerKey);
  }
  return nextUrl;
};
