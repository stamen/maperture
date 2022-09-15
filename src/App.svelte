<script>
  import mapboxgl from 'mapbox-gl';
  import maplibregl from 'maplibre-gl';
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

  // config is set only once on load and is assumed to be loaded from a module
  const config = makeConfig(localConfig);
  const { mapboxGlAccessToken, stylePresetUrls } = config;
  configStore.set(config);

  // settings contains all of the current state of the app that we might want to
  // persist in the URL
  let settings = getSettings(config);

  // mapState is a convenience object, subset of settings
  let mapState = {};

  // Track when the app is attempting to write the hash
  let writingHash = false;

  const hashShouldUpdate = () =>
    location.hash.slice(1) !== createHashString(settings);

  // Set maps and presets initially using settings
  mapsStore.set(settings.maps.map((map, index) => ({ ...map, index })));
  stylePresetsStore.set(settings.stylePresets);

  onMount(() => {
    // If we have URLs for preset files, get them and update presets
    if (stylePresetUrls.length > 0) {
      stylePresetUrls.forEach(async url => {
        const presets = await loadPresetsFromUrl(url);
        stylePresetsStore.update(current => [...current, ...presets]);
      });
    }
  });

  // Detect changes in hash and update settings appropriately
  window.addEventListener('hashchange', () => {
    if (!writingHash && hashShouldUpdate()) {
      settings = getSettings(config);

      // Update mapsStore if necessary
      if (settings.maps.length) {
        const newMaps = settings.maps.map((map, index) => ({
          ...map,
          index,
        }));
        mapsStore.set(newMaps);
      }
    }

    // Reset so we will see the next change
    writingHash = false;
  });

  mapsStore.subscribe(maps => {
    settings = { ...settings, maps };
  });

  // Throttle writing to the hash since this can get invoked many times when
  // moving the map around
  const throttledWriteHash = throttle(() => {
    if (hashShouldUpdate()) {
      writingHash = true;
      writeHash(settings);
    }
  }, 250);

  $: if (settings) throttledWriteHash();

  const createMapState = () => {
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

    return {
      bearing,
      center,
      pitch,
      showCollisions,
      showBoundaries,
      zoom,
      ...(height && { height }),
      ...(width && { width }),
    };
  };

  $: if (settings || height || width) mapState = createMapState();

  // Validate map state when maps change too
  $: mapState = validateMapState(mapState, settings.maps);

  const handleMapState = event => {
    let newMapState = {
      ...mapState,
      ...event.detail.options,
    };

    settings = {
      ...settings,
      ...validateMapState(newMapState, settings.maps),
    };
  };

  const handleViewMode = event => {
    settings = {
      ...settings,
      viewMode: event.detail.mode,
    };
  };

  const handleDimensions = event => {
    settings = {
      ...settings,
      // contains width and height
      ...event.detail,
    };
  };

  // Set RTL plugin once rather than per map
  mapboxgl.setRTLTextPlugin(
    'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js'
  );
  maplibregl.setRTLTextPlugin(
    'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js'
  );
</script>

<svelte:head>
  <base href="process.env.BASE_PATH" />
</svelte:head>
<main>
  <Maps
    maps={settings.maps}
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
