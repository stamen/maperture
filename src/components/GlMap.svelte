<script>
  import deepEqual from 'deep-equal';
  import throttle from 'lodash.throttle';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { config as configStore } from '../stores';

  export let id;
  export let bearing;
  export let center;
  export let pitch;
  export let showCollisions;
  export let showBoundaries;
  export let zoom;
  export let mapStyle;
  export let numberOfMaps;

  export let mapRenderer;

  let renderer;

  // Mapbox and MapLibre share a Map component since they are so similar and utilize the same methods
  const importRenderer = async () => {
    if (mapRenderer === 'maplibre-gl') {
      await import('maplibre-gl/dist/maplibre-gl.css');
      renderer = await import('maplibre-gl');
    } else {
      await import('mapbox-gl/dist/mapbox-gl.css');
      renderer = await import('mapbox-gl');
      renderer.accessToken = $configStore.mapboxGlAccessToken;

      // Set if your Mapbox flavored style uses a different server than `api.mapbox.com`.
      if ($configStore.mapboxBaseApiUrl) {
        renderer.baseApiUrl = $configStore.mapboxBaseApiUrl;
      }
    }
  };

  const dispatch = createEventDispatcher();

  let style = {};
  let url;
  let popup = null;
  let isPopupOpen = false;

  let map;
  let mapViewProps = {};

  // We can set style (an object) here because mapStyle only changes when it needs to
  $: ({ style, url } = mapStyle);
  // We group map-view props here as they are useful in a few contexts
  $: mapViewProps = { bearing, center, pitch, zoom };

  const getCurrentMapView = () => {
    return {
      bearing: map.getBearing(),
      center: map.getCenter(),
      pitch: map.getPitch(),
      zoom: map.getZoom(),
    };
  };

  const shouldUpdateMapView = () => {
    return !deepEqual(getCurrentMapView(), mapViewProps);
  };

  const updateMapStyle = (map, url, style) => {
    if (!map) return;
    map.setStyle(url || style);
  };

  const updateMapFromProps = (map, mapView) => {
    if (!map || !shouldUpdateMapView(mapView)) return;
    map.jumpTo(mapView);
  };

  // The Mapbox/Maplibre popup requires HTML as a string
  // This means class names for the popup need to live in global.css
  // because Svelte won't compile unused CSS classes that live in this component
  const getPopupHtmlString = features => {
    const dedupedFeatures = features.reduce((acc, feature) => {
      const { source, sourceLayer, properties } = feature;
      const isDuplicate = acc.some(f => {
        const isSameSource =
          f.source === source && f.sourceLayer === sourceLayer;
        const hasSameProperties = Object.keys(properties).every(
          p => properties[p] === f.properties[p]
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

  onMount(async () => {
    await importRenderer();
    const glLibrary = renderer;

    map = new glLibrary.Map({
      container: id,
      style: url,
      preserveDrawingBuffer: true,
      ...mapViewProps,
    });

    // Also focus map on wheel (automatically focused on click)
    const throttledWheelHandler = throttle(() => {
      document.getElementById(id).querySelector('canvas[tabindex="0"]').focus();
    }, 250);
    document
      .getElementById(id)
      .addEventListener('wheel', throttledWheelHandler, { passive: true });

    const handleMove = ({ origin }) => {
      const isFocused =
        document.getElementById(id)?.contains(document.activeElement) ?? false;
      if (isFocused) {
        dispatch('mapMove', { options: getCurrentMapView() });
      }
    };

    map.on('move', e => {
      if (!e?.resize) {
        handleMove(e);
      }
    });

    map.on('click', e => {
      let renderedFeatures = map.queryRenderedFeatures(e.point);
      if (!renderedFeatures.length) return;
      if (!isPopupOpen) {
        popup = new glLibrary.Popup()
          .setLngLat(e.lngLat)
          .setHTML(getPopupHtmlString(renderedFeatures))
          .setMaxWidth(360)
          .addTo(map);

        isPopupOpen = true;

        popup.on('close', () => {
          isPopupOpen = false;
        });
      } else {
        popup.remove();
        popup = null;
      }
    });
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });

  // We check map and mapViewProps here to ensure this reacts to changes to
  // either
  $: updateMapFromProps(map, mapViewProps);

  $: updateMapStyle(map, url, style);

  // Show collisions on the map as desired
  $: map && (map.showCollisionBoxes = showCollisions);

  // Show tile boundaries on the map as desired
  $: map && (map.showTileBoundaries = showBoundaries);

  // Resize the map when adding more maps and changing container size
  $: if (map && numberOfMaps) {
    // As of `v3.0.0` maplibre no longer needs this resizing: https://github.com/maplibre/maplibre-gl-js/blob/main/CHANGELOG.md#potentially-breaking-changes
    if (mapRenderer !== 'maplibre-gl') {
      map.once('render', () => {
        const container = document.getElementById(id);
        if (container) {
          const resizeObserver = new ResizeObserver(() => {
            map.resize({ resize: true });
          });
          resizeObserver.observe(container);
        }
      });
    }
  }
</script>

<div {id} class="map" />

<style>
  .map {
    height: 100%;
  }

  :global(.popup-label-heading) {
    font-size: 14px;
    color: #666;
    font-weight: 200;
    font-style: italic;
  }

  :global(.popup) {
    min-width: 180px;
    padding-right: 12px;
    max-height: 240px;
    overflow: auto;
  }

  :global(.popup-feature) {
    margin-top: 18px;
    margin-left: 3px;
  }

  :global(.popup-feature):first-child {
    margin-top: 0;
  }

  :global(.popup-layer-id) {
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 6px;
  }

  :global(.popup-source) {
    font-weight: 600;
  }

  :global(.popup-source-layer) {
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 6px;
    color: #666;
  }

  :global(.popup-property) {
    line-height: 6px;
    margin-top: 6px;
    margin-bottom: 3px;
    width: 100%;
    padding-bottom: 6px;
    border-bottom: 1px solid lightgray;
  }

  :global(.popup-no-properties) {
    border-bottom: 0px !important;
    color: lightgray;
  }

  :global(.popup-property-id) {
    font-weight: bold;
  }

  :global(.popup-property-value) {
    float: right;
  }

  :global(.mapboxgl-control-container .mapboxgl-ctrl-logo) {
    display: none;
  }
</style>
