const mapboxGlAccessToken =
  'pk.eyJ1Ijoic3RhbWVuIiwiYSI6ImNreWM1emM2NjAyNTgyb25kc2o5ZG1iMmoifQ.o2QhFbe03ilcplg9sAhYZQ';
const amazonLocationApiKey =
  'v1.public.eyJqdGkiOiIyODEyOTE3Yy1jZDNjLTRlYjgtOWM0Ni0zOGM2M2JkM2NiN2UifXEZYVcCi19PbxEZfsE0o27ZTpQnf8PkoDB8hpNKleiPkK5rewQJWnKAp-kE4-XpPhbtk8RSFefX9bT5hWt6ALch7moSiEe8Xm9j-wuBqKDP9aATESbOr-N1wDSJPtqV-gNYvzgF8_zkNODHF-JOZ_xbKhrFDUxXHW6Vjl9q34Le7ZdHsblytyKAGkbrfrCfmaMMR5JZ8eQaEQNzmWv0YCEF0VXOxdkAaeSBB4M50rvY_QG8KQfuRehZ1mlIoOflN-xI1ejfq9nSHDScL-3_wTT4ygn4KIrgeK7zWEinTa_vfNiG6J3W8K8vh4edRAsj4oHql9jDrKeUrqg2MxSiF9A.MGFjMDA4ZmUtYWRiYy00NTgyLTg0Y2MtZTY3MzFlZDRmYTQ1';
const region = 'us-west-2';

const stylePresets = [
  {
    id: 'stamen-watercolor',
    name: 'Stamen Watercolor',
    type: 'leaflet',
    url: 'https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg',
    attribution:
      '&copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>',
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
    name: 'Stamen Toner (Lite)',
    type: 'maplibre-gl',
    url: 'https://tiles.stadiamaps.com/styles/stamen_toner_lite.json',
  },
  {
    name: 'Stamen Raster Layers',
    type: 'sublist',
    presets: [
      {
        id: 'stamen-toner-labels',
        name: 'Stamen Toner (Labels)',
        type: 'leaflet',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}@2x.png',
      },
      {
        id: 'stamen-toner-lines',
        name: 'Stamen Toner (Lines)',
        type: 'leaflet',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}@2x.png',
      },
      {
        id: 'stamen-toner-background',
        name: 'Stamen Toner (Background)',
        type: 'leaflet',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}@2x.png',
      },
      {
        id: 'stamen-terrain-labels',
        name: 'Stamen Terrain (Labels)',
        type: 'leaflet',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}@2x.png',
      },
      {
        id: 'stamen-terrain-lines',
        name: 'Stamen Terrain (Lines)',
        type: 'leaflet',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain_lines/{z}/{x}/{y}@2x.png',
      },
      {
        id: 'stamen-terrain-background',
        name: 'Stamen Terrain (Background)',
        type: 'leaflet',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}@2x.png',
      },
    ],
  },
  //{
  //  id: 'openstreetmap',
  //  name: 'OpenStreetMap',
  //  type: 'leaflet',
  //  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  //  attribution:
  //    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //},
  {
    name: 'Amazon Location Service',
    type: 'sublist',
    presets: [
      {
        id: 'amazon-location-standard-light',
        name: 'AWS Standard Light',
        type: 'maplibre-gl',
        url: `https://maps.geo.${region}.amazonaws.com/v2/styles/Standard/descriptor?key=${amazonLocationApiKey}&color-scheme=Light`,
      },
      {
        id: 'amazon-location-standard-dark',
        name: 'AWS Standard Dark',
        type: 'maplibre-gl',
        url: `https://maps.geo.${region}.amazonaws.com/v2/styles/Standard/descriptor?key=${amazonLocationApiKey}&color-scheme=Dark`,
      },
      {
        id: 'amazon-location-monochrome-light',
        name: 'AWS Monochrome Light',
        type: 'maplibre-gl',
        url: `https://maps.geo.${region}.amazonaws.com/v2/styles/Monochrome/descriptor?key=${amazonLocationApiKey}&color-scheme=Light`,
      },
      {
        id: 'amazon-location-monochrome-dark',
        name: 'AWS Monochrome Dark',
        type: 'maplibre-gl',
        url: `https://maps.geo.${region}.amazonaws.com/v2/styles/Monochrome/descriptor?key=${amazonLocationApiKey}&color-scheme=Dark`,
      },
      {
        id: 'amazon-location-hybrid',
        name: 'AWS Satellite Hybrid',
        type: 'maplibre-gl',
        url: `https://maps.geo.${region}.amazonaws.com/v2/styles/Hybrid/descriptor?key=${amazonLocationApiKey}&color-scheme=Light`,
      },
    ],
  },
  {
    name: 'Mapbox',
    type: 'sublist',
    presets: [
      {
        id: 'mapbox-streets',
        name: 'Mapbox Streets',
        type: 'mapbox-gl',
        url: 'mapbox://styles/mapbox/streets-v11',
      },
      {
        id: 'mapbox-outdoors',
        name: 'Mapbox Outdoors',
        type: 'mapbox-gl',
        url: 'mapbox://styles/mapbox/outdoors-v11',
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
        id: 'mapbox-satellite-streets',
        name: 'Mapbox Satellite Streets',
        type: 'mapbox-gl',
        url: 'mapbox://styles/mapbox/satellite-streets-v11',
      },
    ],
  },
];

const customJs = [];

export {
  customJs,
  mapboxGlAccessToken,
  amazonLocationApiKey,
  region,
  stylePresets,
};
