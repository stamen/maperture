// Replace with your Mapbox GL token, if any
const mapboxGlAccessToken = 'pk.eyAAAABBBCCC';

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

export { mapboxGlAccessToken, stylePresets };
