<script>
  import deepEqual from 'deep-equal';
  import { createEventDispatcher, onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import "mapbox-gl/dist/mapbox-gl.css";
  import { mapboxGlAccessToken } from '../config';

  export let bearing;
  export let center;
  export let id;
  export let pitch;
  export let showCollisions;
  export let url;
  export let zoom;

  const dispatch = createEventDispatcher();
  mapboxgl.accessToken = mapboxGlAccessToken;

  let map;
  let mapViewProps = {};

  // We group map-view props here as they are useful in a few contexts
  $: mapViewProps = { bearing, center, pitch, zoom };

  // We check map and mapViewProps here to ensure this reacts to changes to
  // either
  $: if (map && mapViewProps) updateMapFromProps();

  // Show collisions on the map as desired
  $: if (map) map.showCollisionBoxes = showCollisions;

  const getCurrentMapView = () => {
    return {
      bearing: map.getBearing(),
      center: map.getCenter(),
      pitch: map.getPitch(),
      zoom: map.getZoom(),
    };
  }

  const shouldUpdate = () => {
    return !deepEqual(getCurrentMapView(), mapViewProps);
  };

  const updateMapFromProps = () => {
    if (shouldUpdate(mapViewProps)) map.jumpTo(mapViewProps);
  };

  onMount(() => {
    map = new mapboxgl.Map({
      container: id,
      style: url,
      ...mapViewProps,
    });

    const handleMove = ({ origin }) => {
      dispatch('mapMove', { options: getCurrentMapView() });
    }

    map.on('move', handleMove);
  });
</script>

<div id={id} class="map"></div>

<style>
  .map {
    height: 100%;
  }
</style>
