import { readHash } from './query';
import { mapState, maps, viewMode, stylePresets } from './config';

export const getInitialSettings = () => {
  return {
    ...mapState,
    viewMode,
    maps,
    stylePresets,
    ...readHash(window.location.hash),
  };
};
