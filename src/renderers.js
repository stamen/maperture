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

export const getRenderers = (map, sources) => {
  let mapboxOnly = false;

  if (map.type !== 'mapbox-gl') return typeToRenderers[map.type];

  // If using the mapbox:// protocol, force mapbox-gl
  if (map.url && isMapboxUrl(map.url)) {
    mapboxOnly = true;
  } else if (sources) {
    mapboxOnly = Object.values(sources).some(value => {
      return (
        isMapboxUrl(value?.url) ||
        (value?.tiles ?? []).some(url => isMapboxUrl(url))
      );
    });
  }

  if (mapboxOnly) return [mapboxGlOption];

  return typeToRenderers[map.type];
};
