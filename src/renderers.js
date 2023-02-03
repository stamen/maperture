const glVectorRenderers = [
  { name: 'Mapbox GL JS', value: 'mapbox-gl' },
  { name: 'Maplibre GL JS', value: 'maplibre-gl' },
];

const typeToRenderers = {
  google: [{ name: 'Google Maps', value: 'google' }],
  leaflet: [{ name: 'Leaflet', value: 'leaflet' }],
  tangram: [{ name: 'Tangram (Leaflet)', value: 'tangram' }],
  'vector-gl': glVectorRenderers,
  'mapbox-gl': glVectorRenderers,
  'maplibre-gl': glVectorRenderers,
};

export const getRenderers = mapType => typeToRenderers[mapType];
