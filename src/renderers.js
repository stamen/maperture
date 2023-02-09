import { isMapboxUrl } from './mapbox-urls';

const mapboxGlOption = { name: 'Mapbox GL JS', value: 'mapbox-gl' };

const glVectorRenderers = [
  mapboxGlOption,
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

export const getRenderers = map => {
  // If using the mapbox:// protocol, force mapbox-gl
  if (map.type === 'mapbox-gl' && map.url && isMapboxUrl(map.url)) {
    return [mapboxGlOption];
  }
  return typeToRenderers[map.type];
};
