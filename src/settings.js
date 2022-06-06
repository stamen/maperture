import { readHash } from './query';

export const getSettings = config => {
  const { mapState, maps, viewMode, stylePresets } = config;
  return {
    ...mapState,
    viewMode,
    maps,
    stylePresets,
    ...readHash(window.location.hash),
  };
};
