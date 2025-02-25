/*
 * Add key to MapTiler url if it is missing
 */
export const normalizeMapTilerUrl = (url, maptilerApiKey) => {
  let nextUrl = new URL(url);
  if (
    maptilerApiKey &&
    nextUrl.host === 'api.maptiler.com' &&
    !nextUrl.searchParams.has('key')
  ) {
    nextUrl.searchParams.append('key', maptilerApiKey);
  }
  return nextUrl.toString();
};
