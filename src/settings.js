import { readHash } from './query';
import { mapState, maps } from './config';

export const getInitialSettings = () => {
  return {
    ...mapState,
    maps,
    ...readHash(window.location.hash)
  };
};
