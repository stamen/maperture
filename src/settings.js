import { readHash } from './query';
import {
  defaultMapState,
  defaultMapNames,
  defaultMapStyles,
  defaultMapWatches
} from './config';

export const getInitialSettings = () => {
  return {
    ...defaultMapState,
    names: defaultMapNames,
    styles: defaultMapStyles,
    watches: defaultMapWatches,
    ...readHash(window.location.hash)
  };
}
