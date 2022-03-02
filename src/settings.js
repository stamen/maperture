import { readHash } from './query';
import {
  defaultMapState,
  defaultMapNames,
  defaultMapStyles,
  defaultMapWatches
} from './config';

export const getInitialSettings = () => {
  const urlState = readHash(window.location.hash);

  return {
    bearing: urlState.bearing ? urlState.bearing : defaultMapState.bearing,
    center: urlState.lat && urlState.lng ?
      { lng: urlState.lng, lat: urlState.lat } :
      defaultMapState.center,
    names: urlState.names || defaultMapNames,
    styles: urlState.styles || defaultMapStyles,
    watches: urlState.watches || defaultMapWatches,
    pitch: urlState.pitch != null && !Number.isNaN(urlState.pitch) ?
      urlState.pitch : defaultMapState.pitch,
    showCollisions: urlState.showCollisions === 'true',
    zoom: urlState.zoom ? urlState.zoom : defaultMapState.zoom,
  };
};
