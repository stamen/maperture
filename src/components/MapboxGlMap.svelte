<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import "mapbox-gl/dist/mapbox-gl.css";
  import throttle from 'lodash.throttle';
  import { mapboxGlAccessToken } from '../config';

  export let id;
  export let style;
  export let watch;
  export let bearing;
  export let center;
  export let pitch;
  export let zoom;
  export let showCollisions;
  export let mapStateUpdateOrigin;

  const dispatch = createEventDispatcher();

  let map;

  $: {
    if (map) map.showCollisionBoxes = showCollisions;
  }

  mapboxgl.accessToken = mapboxGlAccessToken;

  const updateMapFromProps = (newState, origin) => {
    const currentMapState = {
      bearing: map.getBearing(),
      center: map.getCenter(),
      pitch: map.getPitch(),
      zoom: map.getZoom(),
    };

    if (id === origin) return;
    map.jumpTo(newState, { origin: 'props' });
  };

  $: {
    const mapState = { bearing, center, pitch, zoom };
    if (map) updateMapFromProps(mapState, mapStateUpdateOrigin);
  }

  onMount(() => {
    map = new mapboxgl.Map({
      container: id,
      style,
      bearing,
      center,
      pitch,
      zoom
    });

    const handleMove = ({ origin }) => {
      if (origin === id || origin === 'props') return;

      const mapState = {
	bearing: map.getBearing(),
	center: map.getCenter(),
	mapStateUpdateOrigin: id,
	pitch: map.getPitch(),
	zoom: map.getZoom(),
      };

      dispatch('mapMove', { options: mapState });
    }

    map.on('move', throttle(handleMove, 50, { leading: true }));
  });
</script>

<div id={id} class="map"></div>

<style>
  .map {
    height: 100%;
  }
</style>
