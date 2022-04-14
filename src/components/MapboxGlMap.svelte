<script>
  import deepEqual from 'deep-equal';
  import throttle from 'lodash.throttle';
  import { createEventDispatcher, onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { mapboxGlAccessToken } from '../config';

  export let index;
  export let id;
  export let bearing;
  export let center;
  export let pitch;
  export let showCollisions;
  export let showBoundaries;
  export let zoom;
  export let mapStyle;

  let style = {};
  let url;

  $: if (mapStyle) ({ style, url } = mapStyle);

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

  onMount(() => {
    map = new mapboxgl.Map({
      container: id,
      style: url,
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

    map.on('move', handleMove);
  });
</script>

<div {id} class="map" />

<style>
  .map {
    height: 100%;
  }
</style>
