const makeConfig = localConfig => {
  const defaultGazetteer = {
    Scenarios: [
      { 'Zoomed out': { pitch: 0, zoom: 10 } },
      { 'Zoomed in/Tilted': { pitch: 45, zoom: 16 } },
    ],
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

  const defaultStyles = [
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
  ];

  const defaultMapState = {
    bearing: 0,
    center: { lng: -73.92169, lat: 40.83962 },
    pitch: 0,
    showCollisions: false,
    showBoundaries: false,
    showDiff: false,
    zoom: 13.25,
  };

  const defaultMaps = defaultStyles.map(
    (style, i) => localConfig?.stylePresets?.[i] ?? style
  );

  const defaultViewMode = 'swipe';

  const defaultBranchPatterns = [
    {
      pattern: '',
      styles: [],
    },
  ];

  const config = {
    maps: defaultMaps,
    mapState: defaultMapState,
    viewMode: defaultViewMode,
    gazetteer: defaultGazetteer,
    branchPatterns: defaultBranchPatterns,
    stylePresetUrls: [],
    ...localConfig,
  };

  return config;
};

export { makeConfig };
