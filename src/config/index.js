import * as localConfig from './local';

const config = {
  defaultMapNames: ['Mapbox Streets', 'Mapbox Light'],
  defaultMapStyles: [
	'mapbox://styles/mapbox/streets-v11',
	'mapbox://styles/mapbox/light-v10'
  ],
  defaultMapWatches: [false, false],
  ...localConfig
};

export const {
  defaultMapNames,
  defaultMapStyles,
  defaultMapWatches,
  mapboxGlAccessToken
} = config;
