<script>
  import {
    maps as mapsStore,
    stylePresets as stylePresetsStore,
    config as configStore,
    mapLocations as mapLocationsStore,
    linkLocations as linkLocationsStore,
  } from './stores';
  import { makeConfig } from './make-config';
  import { validateMapState } from './map-state-utils';
  import Maps from './components/Maps.svelte';
  import MapControls from './components/MapControls.svelte';
  import { addLink } from 'stamen-attribution';
  import isEqual from 'lodash.isequal';

  addLink('https://stamen.com/blog/', 'Learn more');
  addLink('https://github.com/stamen/maperture', 'Fork on Github');

  let { localConfig } = $props();

  // config is set only once on load and is assumed to be loaded from a module
  const config = makeConfig(localConfig);
  const { mapboxGlAccessToken } = config;
  configStore.set(config);

  // TODO(svelte-5-port): URL hash persistence (query.js/settings.js) and
  // remote style-preset-URL polling (presets-utils.js) are deferred for
  // now — state only reflects config defaults, so reloading or sharing a
  // URL won't restore the current view yet.
  let settings = $state({
    ...config.mapState,
    viewMode: config.viewMode,
    maps: config.maps,
    stylePresets: config.stylePresets,
  });

  mapsStore.set(settings.maps.map((map, index) => ({ ...map, index })));
  stylePresetsStore.set(settings.stylePresets);
  mapLocationsStore.set(settings?.locations ?? null);
  if ($mapLocationsStore && $mapLocationsStore.length) {
    linkLocationsStore.set(false);
  }

  // Keep settings.maps in sync whenever mapsStore changes (add/remove map).
  mapsStore.subscribe(value => {
    settings = { ...settings, maps: value };
  });

  mapLocationsStore.subscribe(locations => {
    settings = { ...settings, locations };
  });

  linkLocationsStore.subscribe(value => {
    if (!value && !$mapLocationsStore) {
      const mapLocations = settings.maps.map(() => ({ ...mapState }));
      mapLocationsStore.set(mapLocations);
    }
    if (value && $mapLocationsStore) {
      mapLocationsStore.set(null);
    }
  });

  let mapState = $derived(
    validateMapState(
      {
        bearing: settings.bearing,
        center: settings.center,
        pitch: settings.pitch,
        showCollisions: settings.showCollisions,
        showBoundaries: settings.showBoundaries,
        showDiff: settings.showDiff,
        zoom: settings.zoom,
        ...(settings.height && { height: settings.height }),
        ...(settings.width && { width: settings.width }),
      },
      settings.maps,
    ),
  );

  // Each handler below only reassigns `settings` when something in it
  // actually changes. `settings` is read (in full or in part) by several
  // $derived/effects across the tree, so an unconditional reassignment —
  // even to values that are equal to what's already there — creates a new
  // object identity that would ripple back down as "changed" props,
  // potentially cycling straight back into whatever just called the
  // handler. See https://svelte.dev/e/effect_update_depth_exceeded.
  const handleMapState = ({ options }) => {
    const nextMapState = validateMapState(
      { ...mapState, ...options },
      settings.maps,
    );
    if (isEqual(nextMapState, mapState)) return;
    settings = { ...settings, ...nextMapState };
  };

  const handleViewMode = ({ mode }) => {
    if (mode === settings.viewMode) return;
    settings = { ...settings, viewMode: mode };
  };

  const handleDimensions = dimensions => {
    if (
      dimensions.height === settings.height &&
      dimensions.width === settings.width
    ) {
      return;
    }
    settings = { ...settings, ...dimensions };
  };
</script>

<svelte:head>
  <base href="process.env.BASE_PATH" />
</svelte:head>
<main>
  <Maps
    maps={settings.maps}
    {mapState}
    viewMode={settings.viewMode}
    onMapState={handleMapState}
    onSetDimensions={handleDimensions}
  />

  <div class="attribution-space"></div>

  <div class="map-controls-container">
    <MapControls
      {mapboxGlAccessToken}
      {...mapState}
      viewMode={settings.viewMode}
      onMapState={handleMapState}
      onViewMode={handleViewMode}
    />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .attribution-space {
    height: 33px;
    width: 100%;
    background-color: black;
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
