import * as localConfig from './local.example';

const config = {
  defaultMaps: [
    {
      id: 'mapbox-streets',
      name: 'Mapbox Streets',
      type: 'mapbox-gl',
      url: 'mapbox://styles/mapbox/streets-v11',
    },
    {
      id: 'mapbox-light',
      name: 'Mapbox Light',
      type: 'mapbox-gl',
      url: 'mapbox://styles/mapbox/light-v10',
    }
  ],
  defaultMapState: {
    bearing: 0,
    center: { lng: -73.92169, lat: 40.83962 },
    pitch: 0,
    showCollisions: false,
    zoom: 13.25
  },
  ...localConfig
};

export const {
  defaultMapState,
  defaultMaps,
  mapboxGlAccessToken
} = config;
