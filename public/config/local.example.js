// Replace with your Mapbox GL token, if any
const mapboxGlAccessToken = 'pk.eyAAAABBBCCC';

// Example of setting up a gazetteer object. This is described in the `README`
// but these are the options that populate the dropdown in the UI that take you
// to specific locations or map views. You can add as many as you like here and
// create groupings (in this example, the only group is called Locations).
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

const stylePresets = [
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
  },
  {
    id: 'mapbox-dark',
    name: 'Mapbox Dark',
    type: 'mapbox-gl',
    url: 'mapbox://styles/mapbox/dark-v10',
  },
  {
    id: 'openstreetmap',
    name: 'OpenStreetMap',
    type: 'leaflet',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
];

// Commented out example for branchpattern
// const branchPatterns = [
//   {
//     pattern: 'https://website.com/dist/{branch}/dir-a/path/to/{style}.json',
//     styles: ['style_1', 'style_2'],
//     type: 'mapbox-gl',
//   },
//   {
//     pattern: 'https://website.com/dist/{branch}/dir-b/path/to/{style}.json',
//     styles: ['style_3', 'style_4'],
//     type: 'mapbox-gl',
//   },
// ];

// Example of stylePresetUrls
// const stylePresetUrls = ['./presets/example.json'];

export { gazetteer, mapboxGlAccessToken, stylePresets };
