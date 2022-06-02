<script>
  import mapboxgl from 'mapbox-gl';
  import { onMount } from 'svelte';
  import {
    maps as mapsStore,
    stylePresets as stylePresetsStore,
    config as configStore,
  } from './stores';
  import { makeConfig } from './make-config';
  import { loadPresetsFromUrl } from './presets-utils';
  import Maps from './components/Maps.svelte';
  import MapControls from './components/MapControls.svelte';
  import { createHashString, writeHash } from './query';
  import { getSettings } from './settings';
  import { validateMapState } from './map-state-utils';
  import throttle from 'lodash.throttle';

  export let localConfig;

  let mapState = {};
  let maps = [];
  const config = makeConfig(localConfig);
  let settings = getSettings(config);
  let mapboxGlAccessToken;
  let stylePresetUrls;
  configStore.set(config);
  ({ mapboxGlAccessToken, stylePresetUrls } = config);

  let settingsForHash = {};
  $: if (settings || maps || mapState) {
    settingsForHash = { ...settings, maps, ...mapState };
  }

  // Detect changes in hash and update settings appropriately
  window.addEventListener('hashchange', () => {
    if (location.hash.slice(1) !== createHashString(settingsForHash)) {
      settings = getSettings(config);

      // Update mapsStore if necessary
      if (settings.maps.length) {
        const newMaps = settings.maps.map((map, index) => ({ ...map, index }));
        mapsStore.set(newMaps);
      }
    }
  });

  mapsStore.subscribe(value => (maps = value));

  // Throttle writing to the hash since this can get invoked many times when
  // moving the map around
  const throttledWriteHash = throttle(() => writeHash(settingsForHash), 250);

  $: if (settingsForHash) throttledWriteHash();

  onMount(() => {
    // Set maps and presets initially using settings
    mapsStore.set(settings.maps.map((map, index) => ({ ...map, index })));
    stylePresetsStore.set(settings.stylePresets);

    // If we have URLs for preset files, get them and update presets
    if (stylePresetUrls.length > 0) {
      stylePresetUrls.forEach(async url => {
        const presets = await loadPresetsFromUrl(url);
        stylePresetsStore.update(current => [...current, ...presets]);
      });
    }
  });

  $: {
    const {
      bearing,
      center,
      pitch,
      showCollisions,
      showBoundaries,
      zoom,
      height,
      width,
    } = settings;
    mapState = {
      bearing,
      center,
      pitch,
      showCollisions,
      showBoundaries,
      zoom,
      ...(height && { height }),
      ...(width && { width }),
    };
  }

  // Validate map state when maps change too
  $: mapState = validateMapState(mapState, maps);

  const handleMapState = event => {
    let newMapState = {
      ...mapState,
      ...event.detail.options,
    };

    mapState = validateMapState(newMapState, maps);
  };

  const handleViewMode = event => {
    settings = {
      ...settings,
      ...mapState,
      viewMode: event.detail.mode,
    };
  };

  const handleDimensions = event => {
    settings = {
      ...settings,
      ...mapState,
      // contains width and height
      ...event.detail,
    };
  };

  // Set RTL plugin once rather than per map
  mapboxgl.setRTLTextPlugin(
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js'
  );
</script>

<svelte:head>
  <base href="process.env.BASE_PATH" />
</svelte:head>
<main>
  <Maps
    {maps}
    {mapState}
    viewMode={settings.viewMode}
    on:mapState={handleMapState}
    on:setDimensions={handleDimensions}
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
