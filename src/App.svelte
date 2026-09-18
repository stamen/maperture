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
  import { createHashString, writeHash } from './query';
  import { getSettings } from './settings';
  import Maps from './components/Maps.svelte';
  import MapControls from './components/MapControls.svelte';
  import { addLink } from 'stamen-attribution';
  import isEqual from 'lodash.isequal';
  import throttle from 'lodash.throttle';

  addLink('https://stamen.com/blog/', 'Learn more');
  addLink('https://github.com/stamen/maperture', 'Fork on Github');

  let { localConfig } = $props();

  // config is set only once on load and is assumed to be loaded from a module
  const config = makeConfig(localConfig);
  const { mapboxGlAccessToken } = config;
  configStore.set(config);

  // settings contains all of the current state of the app that we might
  // want to persist in the URL — getSettings layers config defaults under
  // whatever's in the current URL hash.
  let settings = $state(getSettings(config));

  // TODO(svelte-5-port): remote style-preset-URL polling (presets-utils.js)
  // is still deferred — a stylePresetUrls config entry won't fetch anything
  // yet.

  // Plain (non-reactive) flag: set right before *we* write the hash, so the
  // 'hashchange' handler below can tell "the URL just changed because we
  // wrote it" apart from "the user navigated/edited the URL themselves" and
  // skip redundantly re-reading what we just wrote.
  let writingHash = false;

  const hashShouldUpdate = () =>
    location.hash.slice(1) !== createHashString(settings, config)?.nextHash;

  window.addEventListener('hashchange', () => {
    if (!writingHash && hashShouldUpdate()) {
      const nextSettings = getSettings(config);
      settings = nextSettings;

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

  // Throttled since this can get invoked many times when moving the map
  // around.
  const throttledWriteHash = throttle(() => {
    if (hashShouldUpdate()) {
      writingHash = true;
      writeHash(settings, config);
    }
  }, 250);

  // A plain side effect on the browser's URL, not on any Svelte state —
  // this can't loop back into itself the way the reactivity bugs elsewhere
  // in this app did. Depends on `settings` as a whole, matching every
  // handler below always reassigning it wholesale on a real change.
  $effect(() => {
    settings;
    throttledWriteHash();
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
