<script>
  import deepEqual from 'deep-equal';
  import throttle from 'lodash.throttle';
  import { onMount, onDestroy } from 'svelte';
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  let {
    id,
    center,
    zoom,
    mapStyle,
    numberOfMaps,
    overrideLayer,
    onMapMount,
    onMapMove,
  } = $props();

  let map = $state();
  let layer;

  let url = $derived(mapStyle.url);

  // We group map-view props here as they are useful in a few contexts
  let mapViewProps = $derived({ center, zoom });

  const getCurrentMapView = () => ({
    center: map.getCenter(),
    zoom: map.getZoom() - 1,
  });

  const shouldUpdateMapView = mapView =>
    !deepEqual(getCurrentMapView(), mapView);

  onMount(() => {
    map = L.map(id, {
      zoomControl: false,
      zoomDelta: 0.25,
      zoomSnap: 0,
    }).setView(mapViewProps.center, mapViewProps.zoom + 1);
    map.attributionControl.setPrefix('');

    onMapMount(map);

    // Also focus map on wheel (automatically focused on click)
    const throttledWheelHandler = throttle(() => {
      document.getElementById(id)?.focus();
    }, 250);
    document
      .getElementById(id)
      .addEventListener('wheel', throttledWheelHandler, { passive: true });

    const handleMove = ({ origin }) => {
      const isFocused = document.getElementById(id) === document.activeElement;
      if (isFocused) {
        onMapMove({ options: getCurrentMapView() });
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

  $effect(() => {
    if (!map || !shouldUpdateMapView(mapViewProps)) return;
    map.setView(mapViewProps.center, mapViewProps.zoom + 1, { animate: false });
  });

  $effect(() => {
    if (!map) return;

    if (layer) layer.remove();
    // TODO surface attribution
    layer = overrideLayer ?? L.tileLayer(url, { detectRetina: true });
    layer.addTo(map);
  });

  // Resize the map when adding more maps and changing container size
  $effect(() => {
    if (!map || !numberOfMaps) return;
    let resizeObserver;
    map.once('render', () => {
      const container = document.getElementById(id);
      if (!container) return;
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(container);
    });
    return () => resizeObserver?.disconnect();
  });
</script>

<div {id} class="map"></div>

<style>
  .map {
    height: 100%;
  }

  :global(.map .leaflet-pane) {
    z-index: 0;
  }
</style>
