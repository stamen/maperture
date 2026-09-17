// Stands in for a consumer repo's own config module (see README).
const stylePresets = [
  {
    id: 'maplibre-demo',
    name: 'MapLibre Demo',
    type: 'maplibre-gl',
    url: 'https://demotiles.maplibre.org/style.json',
  },
];

const gazetteer = {
  Locations: [
    {
      'San Francisco, CA': {
        zoom: 18,
        center: { lng: -122.4193, lat: 37.7648 },
      },
    },
    {
      'Washington DC': { zoom: 12, center: { lng: -77.0435, lat: 38.9098 } },
    },
  ],
};

export { stylePresets, gazetteer };
