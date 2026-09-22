// The Mapbox/Maplibre popup requires HTML as a string
// This means class names for the popup need to live in global.css
// because Svelte won't compile unused CSS classes that live in this component
export const buildPopupHtml = features => {
  const dedupedFeatures = features.reduce((acc, feature) => {
    const { source, sourceLayer, properties } = feature;
    const isDuplicate = acc.some(f => {
      const isSameSource = f.source === source && f.sourceLayer === sourceLayer;
      const hasSameProperties = Object.keys(properties).every(
        p => properties[p] === f.properties[p],
      );
      return isSameSource && hasSameProperties;
    });

    if (!isDuplicate) {
      acc.push(feature);
    }
    return acc;
  }, []);

  let html = '<div class="popup">';
  for (const feature of dedupedFeatures) {
    html += `<div class="popup-feature">`;
    const { properties, layer } = feature;
    html += `<div class="popup-label-heading">layer id</div>`;
    html += `<div class="popup-layer-id">${layer.id}</div>`;
    html += `<div class="popup-label-heading">source: source-layer</div>`;
    html += `<div class="popup-source-layer"><span class="popup-source">${feature.source}:</span> ${feature.sourceLayer}</div>`;
    if (properties && Object.keys(properties).length) {
      html += `<div class="popup-label-heading">properties</div>`;
      Object.keys(properties)
        .sort()
        .forEach(key => {
          const propertyValue = properties[key];
          html += `<p class="popup-property"><span class="popup-property-id">${key}:</span> <span class="popup-property-value">${propertyValue}</span></p>`;
        });
    } else {
      html += `<p class="popup-no-properties">No properties</p>`;
    }
    html += `</div>`;
  }
  html += '</div>';
  return html;
};
