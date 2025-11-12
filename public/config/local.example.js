// Replace with your Mapbox GL token, if any
const mapboxGlAccessToken = 'pk.eyAAAABBBCCC';

// Replace with your MapTiler API key
const maptilerApiKey = '';

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
    id: 'stamen-watercolor',
    name: 'Stamen Watercolor',
    type: 'leaflet',
    url: 'https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg',
  },
  {
    id: 'stamen-terrain',
    name: 'Stamen Terrain',
    type: 'maplibre-gl',
    url: 'https://tiles.stadiamaps.com/styles/stamen_terrain.json',
  },
  {
    id: 'stamen-toner',
    name: 'Stamen Toner',
    type: 'maplibre-gl',
    url: 'https://tiles.stadiamaps.com/styles/stamen_toner.json',
  },
  {
    id: 'stamen-toner-lite',
    name: 'Stamen Toner Lite',
    type: 'maplibre-gl',
    url: 'https://tiles.stadiamaps.com/styles/stamen_toner_lite.json',
  },
  {
    id: 'stamen-toner-dark',
    name: 'Stamen Toner Dark',
    type: 'maplibre-gl',
    url: 'https://tiles.stadiamaps.com/styles/stamen_toner_dark.json',
  },
  {
    id: 'stamen-toner-blacklite',
    name: 'Stamen Toner Blacklite',
    type: 'maplibre-gl',
    url: 'https://tiles.stadiamaps.com/styles/stamen_toner_blacklite.json',
  },
  {
    id: 'mapbox-streets',
    name: 'Mapbox Streets',
    type: 'mapbox-gl',
    url: 'mapbox://styles/mapbox/streets-v11',
  },
  // sublist is used to nest style options in the dropdown
  // this is helpful if you need to organize a large amount of styles
  {
    name: 'Data viz styles',
    type: 'sublist',
    presets: [
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
    ],
  },
  {
    id: 'openstreetmap',
    name: 'OpenStreetMap',
    type: 'leaflet',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    id: 'maplibre-demo-tiles',
    name: 'Maplibre Demo Tiles',
    type: 'maplibre-gl',
    url: 'https://demotiles.maplibre.org/style.json',
    precompile: {
      // Example script removing layers based on options
      script: (stylesheet, options) => {
        let nextStylesheet = { ...stylesheet };
        nextStylesheet = {
          ...nextStylesheet,
          layers: nextStylesheet.layers.filter(l => !options.includes(l.id)),
        };
        return nextStylesheet;
      },
      options: {
        type: 'checkbox',
        // On initial render, background will be removed by the script
        default: ['background'],
        values: [
          { label: 'Background', value: 'background' },
          { label: 'Coastline', value: 'coastline' },
          { label: 'Countries fill', value: 'countries-fill' },
        ],
      },
    },
  },
  // In order for this to work you need to set the maptilerApiKey
  // {
  //   id: 'maptiler-streets',
  //   name: 'MapTiler Streets',
  //   type: 'maptiler-sdk',
  //   url: 'https://api.maptiler.com/maps/streets-v2/style.json',
  // },
];

const branchPatterns = null; // pass null value to suppress the "Styles on a branch" menu, if you aren't using it

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

export {
  gazetteer,
  mapboxGlAccessToken,
  branchPatterns,
  stylePresets,
  maptilerApiKey,
};
