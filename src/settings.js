import { readHash } from "./query";
import { mapState, maps, viewMode, stylePresets } from "./config";

export const getInitialSettings = () => {
  return {
    viewMode,
    maps,
    stylePresets,
    ...mapState,
    ...readHash(window.location.hash),
  };
};
