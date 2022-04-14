import {
  GOOGLE_MAP_MAX_PITCH_LOW_ZOOM,
  GOOGLE_MAP_MAX_PITCH_HIGH_ZOOM,
  GOOGLE_MAP_MAX_PITCH_ZOOM_THRESHHOLD,
  MAPBOX_GL_MAX_PITCH,
} from './constants';

const googleMapPresent = maps => maps.some(({ type }) => type === 'google');

const getMaxPitch = (mapState, maps) => {
  const googleMapPresent = maps.some(({ type }) => type === 'google');
  if (googleMapPresent) {
    return mapState.zoom < GOOGLE_MAP_MAX_PITCH_ZOOM_THRESHHOLD
      ? GOOGLE_MAP_MAX_PITCH_LOW_ZOOM
      : GOOGLE_MAP_MAX_PITCH_HIGH_ZOOM;
  }
  return MAPBOX_GL_MAX_PITCH;
};

export const getMapStateMessages = (mapState, maps) => {
  const messages = [];

  const maxPitch = getMaxPitch(mapState, maps);
  if (mapState.pitch >= maxPitch) {
    messages.push({
      type: 'warning',
      message: `Pitch capped at ${maxPitch} as that is the maximum for this zoom level.`,
    });
  }

  return messages;
};

export const validateMapState = (mapState, maps) => {
  const newMapState = { ...mapState };
  if (googleMapPresent(maps)) {
    const maxPitch = getMaxPitch(mapState, maps);
    if (newMapState.pitch > maxPitch) {
      newMapState.pitch = maxPitch;
    }
  }

  return newMapState;
};
