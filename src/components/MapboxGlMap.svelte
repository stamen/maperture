<script>
  import deepEqual from 'deep-equal';
  import { config as configStore } from '../stores';
  import throttle from 'lodash.throttle';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';

  export let index;
  export let id;
  export let bearing;
  export let center;
  export let pitch;
  export let showCollisions;
  export let showBoundaries;
  export let zoom;
  export let mapStyle;
  export let numberOfMaps;

  let style = {};
  let url;
  let popup = null;
  let isPopupOpen = false;

  $: if (mapStyle) ({ style, url } = mapStyle);

  let mapboxGlAccessToken;
  configStore.subscribe(value => ({ mapboxGlAccessToken } = value));

  const dispatch = createEventDispatcher();
  mapboxgl.accessToken = mapboxGlAccessToken;

  let map;
  let mapViewProps = {};

  // We group map-view props here as they are useful in a few contexts
  $: mapViewProps = { bearing, center, pitch, zoom };

  // We check map and mapViewProps here to ensure this reacts to changes to
  // either
  $: if (map && mapViewProps) updateMapFromProps();

  $: if (map && (url || style)) updateMapStyle();

  // Show collisions on the map as desired
  $: if (map) map.showCollisionBoxes = showCollisions;

  // Show tile boundaries on the map as desired
  $: if (map) map.showTileBoundaries = showBoundaries;

  // Resize the map when adding more maps and changing container size
  $: {
    if (map && numberOfMaps) {
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

  const updateMapStyle = () => {
    map.setStyle(url);
  };

  const updateMapFromProps = () => {
    if (shouldUpdateMapView(mapViewProps)) map.jumpTo(mapViewProps);
  };

  // The Mapbox popup requires HTML as a string
  // This means class names for the popup need to live in global.css
  // because Svelte won't compile unused CSS classes that live in this component
  const getPopupHtmlString = features => {
    let html = '<div class="popup">';
    for (const feature of features) {
      const { properties } = feature;
      html += `<h2 class="popup-source-layer">${feature.source}: ${feature.sourceLayer}</h2>`;
      if (properties) {
        Object.keys(properties).forEach(key => {
          const propertyValue = properties[key];
          html += `<p class="popup-property"><span class="popup-property-id">${key}:</span> <span class="popup-property-value">${propertyValue}</span></p>`;
        });
      }
    }
    html += '</div>';
    return html;
  };

  onMount(() => {
    map = new mapboxgl.Map({
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
      const isFocused = document
        .getElementById(id)
        .contains(document.activeElement);
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
      const renderedFeatures = map.queryRenderedFeatures(e.point);

      if (!isPopupOpen) {
        popup = new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(getPopupHtmlString(renderedFeatures))
          .setMaxWidth(360)
          .addTo(map);
      } else {
        popup.remove();
        popup = null;
      }
      isPopupOpen = !isPopupOpen;
    });
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });
</script>

<div {id} class="map" />

<style>
  .map {
    height: 100%;
  }
</style>
