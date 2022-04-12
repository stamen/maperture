<script>
  import { onMount } from 'svelte';
  import { stylePresets as stylePresetsStore } from './stores';
  import { loadPresetsFromUrl } from './presets-utils';
  import Maps from './components/Maps.svelte';
  import MapControls from './components/MapControls.svelte';
  import { writeHash } from './query';
  import { getInitialSettings } from './settings';
  import { mapboxGlAccessToken, stylePresetUrls } from './config';
  import throttle from 'lodash.throttle';

  export let parentAppTitle;

  let mapState = {};
  let maps = [];
  let settings = getInitialSettings();

  // Throttle writing to the hash since this can get invoked many times when
  // moving the map around
  const throttledWriteHash = throttle(() => {
    writeHash({ ...settings, ...mapState });
  }, 250);

  onMount(() => {
    // Set presets initially using settings
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

  $: {
    const { bearing, center, pitch, showCollisions, showBoundaries, zoom } =
      settings;
    mapState = { bearing, center, pitch, showCollisions, showBoundaries, zoom };
  }

  $: {
    maps = settings.maps.map((map, index) => ({ ...map, index }));
  }

  const handleChangeMap = event => {
    const { url, style, index, branch } = event.detail;
    let nextMap;
    let nextMaps = maps;
    // Pass the stylesheet directly into state so we can detect local changes
    nextMap = {
      id: style.id,
      index,
      name: style.name,
      type: 'mapbox-gl',
      url,
      style,
      // branch is only defined for branch styles
      branch,
    };

    nextMaps.splice(index, 1, nextMap);
    maps = nextMaps;
    // Remove the stylesheet for a more concise hash
    const mapsHash = JSON.parse(JSON.stringify(maps)).map(m => {
      delete m.style;
      return m;
    });

    writeHash({ ...settings, maps: mapsHash, ...mapState });
  };

  const handleMapState = event => {
    mapState = {
      ...mapState,
      ...event.detail.options,
    };
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
  <div>{parentAppTitle}</div>
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
