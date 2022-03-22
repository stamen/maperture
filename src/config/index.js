import * as localConfig from './local';

const defaultGazetteer = {
  Scenarios: [
    { 'Scenario A': { pitch: 0, zoom: 10 } },
    { 'Scenario B': { pitch: 45, zoom: 16 } }
  ],
  Locations: [
    { 'Location A': { zoom: 18, center: [-122.4193, 37.7648] } },
    { 'Location B': { zoom: 12, center: [-77.0435, 38.9098] } }
  ]
};

const config = {
  defaultMaps: [
    {
      id: 'mapbox-streets',
      name: 'Mapbox Streets',
      type: 'mapbox-gl',
      url: 'mapbox://styles/mapbox/streets-v11'
    },
    {
      id: 'mapbox-light',
      name: 'Mapbox Light',
      type: 'mapbox-gl',
      url: 'mapbox://styles/mapbox/light-v10'
    }
  ],
  defaultMapState: {
    bearing: 0,
    center: { lng: -73.92169, lat: 40.83962 },
    pitch: 0,
    showCollisions: false,
    zoom: 13.25
  },
  gazetteer: defaultGazetteer,
  ...localConfig
};

export const { defaultMapState, defaultMaps, gazetteer, mapboxGlAccessToken } =
  config;
