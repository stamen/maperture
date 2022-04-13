import { GOOGLE_MAP_MAX_PITCH } from './constants';

export const validateMapState = (mapState, maps) => {
  const newMapState = { ...mapState };
  const googleMapPresent = maps.some(({ type }) => type === 'google');
  if (googleMapPresent) {
    if (newMapState.pitch > GOOGLE_MAP_MAX_PITCH) {
      newMapState.pitch = GOOGLE_MAP_MAX_PITCH;
    }
  }

  return newMapState;
};
