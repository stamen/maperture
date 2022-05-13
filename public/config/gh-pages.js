const mapboxGlAccessToken =
  'pk.eyJ1Ijoic3RhbWVuIiwiYSI6ImNreWM1emM2NjAyNTgyb25kc2o5ZG1iMmoifQ.o2QhFbe03ilcplg9sAhYZQ';

const stylePresets = [
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
];

export { mapboxGlAccessToken, stylePresets };
