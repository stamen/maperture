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
  const [, , , userName, styleId] = url.split('/');
  return `https://api.mapbox.com/styles/v1/${userName}/${styleId}?title=true&access_token=${accessToken}`;
};
