import { GOOGLE_MAP_MAX_PITCH } from './constants';

export const checkMapState = (mapState, maps) => {
  const messages = [];

  const googleMapPresent = maps.some(({ type }) => type === 'google');
  if (googleMapPresent) {
    if (mapState.pitch >= GOOGLE_MAP_MAX_PITCH) {
      messages.push({
        type: 'warning',
        message: `Pitch capped at ${GOOGLE_MAP_MAX_PITCH} as that is the maximum for Google Maps.`,
      });
    }
  }

  return messages;
};

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
