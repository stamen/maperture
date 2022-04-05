<script>
  import Maps from './components/Maps.svelte';
  import MapControls from './components/MapControls.svelte';
  import { writeHash } from './query';
  import { getInitialSettings } from './settings';
  import { mapboxGlAccessToken } from './config';
  import { GOOGLE_MAP_MAX_PITCH } from './constants';
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
    const { bearing, center, pitch, showCollisions, showBoundaries, zoom } =
      settings;
    mapState = { bearing, center, pitch, showCollisions, showBoundaries, zoom };
  }

  $: {
    maps = settings.maps.map((map, index) => ({ ...map, index }));
  }

  const handleChangeMap = event => {
    const { id, name, index, type, options } = event.detail;
    maps[index] = { id, name, index, type, options };

    // Remove the stylesheet for a more concise hash
    const mapsHash = JSON.parse(JSON.stringify(maps)).map(m => {
      delete m.options.style;
      return m;
    });

    writeHash({ ...settings, maps: mapsHash, ...mapState });
  };

  const handleMapState = event => {
    let newMapState = {
      ...mapState,
      ...event.detail.options,
    };

    if (maps.some(({ type }) => type === 'google')) {
      if (newMapState.pitch > GOOGLE_MAP_MAX_PITCH) {
        newMapState.pitch = GOOGLE_MAP_MAX_PITCH;
      }
    }
    mapState = newMapState;
  };

  const handleViewMode = event => {
    settings = {
      ...settings,
      ...mapState,
      viewMode: event.detail.mode,
    };
  };
</script>

<main>
  <Maps
    {maps}
    {mapState}
    viewMode={settings.viewMode}
    on:mapState={handleMapState}
    on:mapStyleState={handleChangeMap}
  />

  <div class="map-controls-container">
    <MapControls
      {mapboxGlAccessToken}
      {...mapState}
      viewMode={settings.viewMode}
      on:mapState={handleMapState}
      on:viewMode={handleViewMode}
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
