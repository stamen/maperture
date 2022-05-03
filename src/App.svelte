<script>
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
  import { writeHash } from './query';
  import { getInitialSettings } from './settings';
  import { validateMapState } from './map-state-utils';
  import throttle from 'lodash.throttle';

  export let localConfig;

  let mapState = {};
  let maps = [];
  const config = makeConfig(localConfig);
  let settings = getInitialSettings(config);
  let mapboxGlAccessToken;
  let stylePresetUrls;
  configStore.set(config);
  ({ mapboxGlAccessToken, stylePresetUrls } = config);

  mapsStore.subscribe(value => (maps = value));

  // Throttle writing to the hash since this can get invoked many times when
  // moving the map around
  const throttledWriteHash = throttle(() => {
    writeHash({ ...settings, ...mapState });
  }, 250);

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

  $: if (settings && mapState) throttledWriteHash();
  $: if (maps) {
    // Remove the stylesheet for a more concise hash
    const mapsHash = JSON.parse(JSON.stringify(maps)).map(m => {
      delete m.style;
      return m;
    });

    writeHash({ ...settings, maps: mapsHash, ...mapState });
  }

  $: {
    const { bearing, center, pitch, showCollisions, showBoundaries, zoom } =
      settings;
    mapState = { bearing, center, pitch, showCollisions, showBoundaries, zoom };
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
</script>

<svelte:head>
  <base href="process.env.BASE_PATH" />
</svelte:head>
<main>
  <div id="maps-view">
    <Maps
      {maps}
      {mapState}
      viewMode={settings.viewMode}
      on:mapState={handleMapState}
    />
  </div>
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

  #maps-view {
    height: 100%;
    width: 100%;
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
