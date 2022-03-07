<script>
  import Maps from './components/Maps.svelte';
  import MapControls from './components/MapControls.svelte';
  import { writeHash } from './query';
  import { getInitialSettings } from './settings';
  import { mapboxGlAccessToken } from './config';
  import throttle from 'lodash.throttle';

  let mapState = {};
  let maps = [];
  let settings = getInitialSettings();

  // Throttle writing to the hash since this can get invoked many times when
  // moving the map around
  const throttledWriteHash = throttle(() => {
    writeHash({ ...settings, ...mapState });
  }, 250);

  $: if (settings && mapState) throttledWriteHash();

  $: {
    const { bearing, center, pitch, showCollisions, zoom } = settings;
    mapState = { bearing, center, pitch, showCollisions, zoom };
  }

  $: {
    maps = settings.maps.map((map, index) => ({ ...map, index }));
  }

  const handleMapState = event => {
    mapState = {
      ...mapState,
      ...event.detail.options
    };
  };
</script>

<main>
  <Maps {maps} {mapState} on:mapState={handleMapState} />

  <div class="map-controls-container">
    <MapControls
      mapboxGlAccessToken={mapboxGlAccessToken}
      {...mapState}
      on:mapState={handleMapState}
    />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .map-controls-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: absolute;
    top: 1em;
    width: 100%;
    z-index: 2000;
  }
</style>
