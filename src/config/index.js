import * as localConfig from './local';

const config = {
  defaultMapNames: ['Mapbox Streets', 'Mapbox Light'],
  defaultMapStyles: [
    'mapbox://styles/mapbox/streets-v11',
    'mapbox://styles/mapbox/light-v10'
  ],
  defaultMapWatches: [false, false],
  defaultMapState: {
    bearing: 0,
    center: { lng: -73.92169, lat: 40.83962 },
    pitch: 0,
    zoom: 13.25
  },
  ...localConfig
};

export const {
  defaultMapState,
  defaultMapNames,
  defaultMapStyles,
  defaultMapWatches,
  mapboxGlAccessToken
} = config;
