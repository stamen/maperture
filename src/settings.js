import { readHash } from "./query";
import { defaultMapState, defaultMaps, defaultViewMode } from "./config";

export const getInitialSettings = () => {
  return {
    ...defaultMapState,
    viewMode: defaultViewMode,
    maps: defaultMaps,
    ...readHash(window.location.hash),
  };
};
