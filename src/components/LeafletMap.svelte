<script>
  import deepEqual from 'deep-equal';
  import throttle from 'lodash.throttle';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  export let id;
  export let center;
  export let zoom;
  export let mapStyle;
  export let numberOfMaps;
  export let overrideLayer;

  const dispatch = createEventDispatcher();

  let url;

  let map;
  let layer;
  let mapViewProps = {};

  $: ({ url } = mapStyle);

  // We group map-view props here as they are useful in a few contexts
  $: mapViewProps = { center, zoom };

  const getCurrentMapView = () => {
    return {
      center: map.getCenter(),
      zoom: map.getZoom() - 1,
    };
  };

  const shouldUpdateMapView = () => {
    return !deepEqual(getCurrentMapView(), mapViewProps);
  };

  const updateMapStyle = (map, url, overrideLayer) => {
    if (!map) return;

    if (layer) layer.remove();

    if (overrideLayer) {
      layer = overrideLayer;
    } else {
      // TODO surface attribution
      layer = L.tileLayer(url, { detectRetina: true });
    }

    layer.addTo(map);
  };

  const updateMapFromProps = (map, mapView) => {
    if (!map || !shouldUpdateMapView(mapView)) return;
    map.setView(mapView.center, mapView.zoom + 1, { animate: false });
  };

  onMount(async () => {
    map = L.map(id, {
      zoomControl: false,
      zoomDelta: 0.25,
      zoomSnap: 0,
    }).setView(mapViewProps.center, mapViewProps.zoom + 1);
    map.attributionControl.setPrefix('');

    // Also focus map on wheel (automatically focused on click)
    const throttledWheelHandler = throttle(() => {
      document.getElementById(id).focus();
    }, 250);
    document
      .getElementById(id)
      .addEventListener('wheel', throttledWheelHandler, { passive: true });

    const handleMove = ({ origin }) => {
      const isFocused = document.getElementById(id) === document.activeElement;
      if (isFocused) {
        dispatch('mapMove', { options: getCurrentMapView() });
      }
    };

    map.on('move', e => {
      if (!e?.resize) {
        handleMove(e);
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

  $: updateMapStyle(map, url, overrideLayer);

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
</script>

<div {id} class="map" />

<style>
  .map {
    height: 100%;
  }

  :global(.map .leaflet-pane) {
    z-index: 0;
  }
</style>
