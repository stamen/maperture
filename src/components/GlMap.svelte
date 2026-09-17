<script>
  import maplibregl from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import deepEqual from 'deep-equal';
  import { onMount, onDestroy } from 'svelte';

  // TODO(svelte-5-port): mapbox-gl and maptiler-sdk support (dynamically
  // imported, chosen via the `mapRenderer` prop) and click-to-inspect
  // popups are deferred — this only drives maplibre-gl for now. See
  // Map.svelte's TODO for the renderer-switch this depends on.
  let {
    id,
    bearing,
    center,
    pitch,
    showCollisions,
    showBoundaries,
    zoom,
    mapStyle,
    numberOfMaps,
    onMapMount,
    onMapMove,
  } = $props();

  let map = $state();

  let style = $derived(mapStyle.style);
  let url = $derived(mapStyle.url);

  // We group map-view props here as they are useful in a few contexts
  let mapViewProps = $derived({ bearing, center, pitch, zoom });

  const getCurrentMapView = () => ({
    bearing: map.getBearing(),
    center: map.getCenter(),
    pitch: map.getPitch(),
    zoom: map.getZoom(),
  });

  const shouldUpdateMapView = mapView => !deepEqual(getCurrentMapView(), mapView);

  onMount(() => {
    map = new maplibregl.Map({
      container: id,
      style: url || style,
      canvasContextAttributes: { preserveDrawingBuffer: true },
      preserveDrawingBuffer: true,
      ...mapViewProps,
    });

    onMapMount(map);

    const handleMove = ({ origin }) => {
      const isFocused =
        document.getElementById(id)?.contains(document.activeElement) ?? false;
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
    map.jumpTo(mapViewProps);
  });

  $effect(() => {
    if (!map) return;
    map.setStyle(url || style);
  });

  // Show collisions on the map as desired
  $effect(() => {
    if (map) map.showCollisionBoxes = showCollisions;
  });

  // Show tile boundaries on the map as desired
  $effect(() => {
    if (map) map.showTileBoundaries = showBoundaries;
  });
</script>

<div {id} class="map"></div>

<style>
  .map {
    height: 100%;
  }

  :global(.mapboxgl-control-container .mapboxgl-ctrl-logo) {
    display: none;
  }
</style>
