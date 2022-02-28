import { readHash } from './query';
import { defaultMapNames, defaultMapStyles, defaultMapWatches } from './config';

export const getInitialSettings = () => {
  const urlState = readHash(window.location.hash);

  return {
    bearing: urlState.bearing ? urlState.bearing : 0,
    center: urlState.lat && urlState.lng ?
      { lng: urlState.lng, lat: urlState.lat } :
      { lng: -73.92169, lat: 40.83962 },
	names: urlState.names || defaultMapNames,
	styles: urlState.styles || defaultMapStyles,
	watches: urlState.watches || defaultMapWatches,
    pitch: urlState.pitch != null && !Number.isNaN(urlState.pitch) ? urlState.pitch : 0,
    showCollisions: urlState.showCollisions === 'true',
    zoom: urlState.zoom ? urlState.zoom : 13.25,
  };
};
