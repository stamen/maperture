const mapboxGlAccessToken =
  'pk.eyJ1Ijoic3RhbWVuIiwiYSI6ImNreWM1emM2NjAyNTgyb25kc2o5ZG1iMmoifQ.o2QhFbe03ilcplg9sAhYZQ';

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
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>',
  },
  {
    id: 'stamen-toner',
    name: 'Stamen Toner',
    type: 'maplibre-gl',
    url: 'https://tiles.stadiamaps.com/styles/stamen_toner.json',
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>',
  },
  {
    id: 'stamen-toner-lite',
    name: 'Stamen Toner (Lite)',
    type: 'maplibre-gl',
    url: 'https://tiles.stadiamaps.com/styles/stamen_toner_lite.json',
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>',
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
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>',
      },
      {
        id: 'stamen-toner-lines',
        name: 'Stamen Toner (Lines)',
        type: 'leaflet',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lines/{z}/{x}/{y}@2x.png',
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>',
      },
      {
        id: 'stamen-toner-background',
        name: 'Stamen Toner (Background)',
        type: 'leaflet',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}@2x.png',
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>',
      },
      {
        id: 'stamen-terrain-labels',
        name: 'Stamen Terrain (Labels)',
        type: 'leaflet',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}@2x.png',
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>',
      },
      {
        id: 'stamen-terrain-lines',
        name: 'Stamen Terrain (Lines)',
        type: 'leaflet',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain_lines/{z}/{x}/{y}@2x.png',
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>',
      },
      {
        id: 'stamen-terrain-background',
        name: 'Stamen Terrain (Background)',
        type: 'leaflet',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}@2x.png',
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about/" target="_blank">OpenStreetMap contributors</a>',
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
    name: 'Mapbox',
    type: 'sublist',
    presets: [
      {
        id: 'mapbox-streets',
        name: 'Mapbox Streets',
        type: 'mapbox-gl',
        url: 'mapbox://styles/mapbox/streets-v12',
      },
      {
        id: 'mapbox-outdoors',
        name: 'Mapbox Outdoors',
        type: 'mapbox-gl',
        url: 'mapbox://styles/mapbox/outdoors-v12',
      },
      {
        id: 'mapbox-light',
        name: 'Mapbox Light',
        type: 'mapbox-gl',
        url: 'mapbox://styles/mapbox/light-v11',
      },
      {
        id: 'mapbox-dark',
        name: 'Mapbox Dark',
        type: 'mapbox-gl',
        url: 'mapbox://styles/mapbox/dark-v11',
      },
      {
        id: 'mapbox-satellite-streets',
        name: 'Mapbox Satellite Streets',
        type: 'mapbox-gl',
        url: 'mapbox://styles/mapbox/satellite-streets-v12',
      },
    ],
  },
];

export { mapboxGlAccessToken, stylePresets };
