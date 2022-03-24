import { readHash } from "./query";
import { defaultMapState, defaultMaps } from "./config";

export const getInitialSettings = () => {
  return {
    ...defaultMapState,
    maps: defaultMaps,
    ...readHash(window.location.hash),
  };
};
