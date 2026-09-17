<script>
  import { untrack } from 'svelte';
  import isEqual from 'lodash.isequal';
  import GlMap from './GlMap.svelte';
  import MapLabel from './MapLabel.svelte';
  import {
    maps as mapsStore,
    linkLocations as linkLocationsStore,
    mapLocations as mapLocationsStore,
    mapObj as mapObjStore,
    config as configStore,
  } from '../stores';
  import { validateMapState } from '../map-state-utils';
  import { normalizeUrl } from '../transform-urls';

  let {
    map,
    numberOfMaps,
    highlightDifferences = false,
    labelStyle = '',
    onMapMove,
    ...restProps
  } = $props();

  // TODO(svelte-5-port): the renderer switch (google/leaflet/tangram, and
  // mapbox-gl/maptiler-sdk within GlMap) is deferred — every map renders
  // through GlMap/maplibre-gl for now, regardless of its configured
  // renderer/type. MapStyleInputWrapper normally writes a `renderer` field
  // onto the map object when a style is picked; until that's ported, fall
  // back to `type` so existing config data still resolves to something.
  let mapRenderer = $derived(map.renderer ?? map.type);
  const MapComponent = GlMap;

  let mapId = $derived(`${map.id}-${map.index}`);

  // Only use this when locations are unlinked
  let localMapState = $derived($mapLocationsStore?.[map.index] ?? {});

  // Update stylesheet variable only if there's been actual changes. This
  // reads `stylesheet` via untrack() specifically so the effect depends
  // only on `map` — not on its own output — which is the same class of bug
  // as https://svelte.dev/e/effect_update_depth_exceeded (see App.svelte's
  // handleMapState). It's dormant today since nothing currently reassigns
  // map.style, but will matter once style-switching is un-stubbed.
  let stylesheet = $state(map?.style);
  $effect(() => {
    const nextStyle = map?.style;
    if (!isEqual(untrack(() => stylesheet), nextStyle)) {
      stylesheet = nextStyle;
    }
  });

  let props = $derived.by(() => {
    const keys = {
      mapboxKey: $configStore.mapboxGlAccessToken,
      maptilerKey: $configStore.maptilerApiKey,
    };
    // Referenced so this recomputes for locally-served styles whose contents
    // change without the map's `url`/id changing.
    stylesheet;
    return {
      id: mapId,
      mapStyle: {
        ...map,
        url: normalizeUrl(map.url, keys),
      },
      numberOfMaps,
      mapRenderer,
    };
  });

  const removeMap = () => {
    mapsStore.update(current =>
      current
        .filter((_, i) => i !== map.index)
        .map((item, i) => ({ ...item, index: i }))
    );

    if (!$linkLocationsStore) {
      mapLocationsStore.update(current =>
        current.filter((_, i) => i !== map.index)
      );
    }
  };

  const getMapStateProps = props => {
    if ($linkLocationsStore) return props;
    const { bearing, center, pitch, zoom, ...otherProps } = props;
    const localOptions = {
      bearing,
      center,
      pitch,
      zoom,
      ...localMapState,
    };
    let nextProps = { ...otherProps, ...localOptions };
    nextProps = validateMapState(nextProps, [map]);

    return nextProps;
  };

  let mapStateProps = $derived(getMapStateProps(restProps));

  const handleMapMove = ({ options }) => {
    if (!$linkLocationsStore) {
      mapLocationsStore.update(value =>
        value.map((v, i) => (i === map.index ? options : v))
      );
    } else {
      onMapMove({ options });
    }
  };

  const onMapMount = mapObj => {
    mapObjStore.update(store => ({ ...store, [map.index]: mapObj }));
  };
</script>

<div class="map-container">
  <div class="screenshot-label-transparent">
    {#if map?.branch}
      <div class="screenshot-text">
        {map.screenshotName ?? map.name ?? map.id}
        <span class="screenshot-label-bold">&nbsp;{map.branch}</span>
      </div>
    {:else}
      {map.name ?? map.id}
    {/if}
  </div>
  <div class="map" class:highlight-diff={highlightDifferences}>
    <MapComponent
      {onMapMount}
      {...props}
      {...mapStateProps}
      onMapMove={handleMapMove}
    />
  </div>
  <!-- Use the number of maps and index to reset map on adding and removing maps -->
  <!-- We don't want to use the map id here or we'll unnecessarily remount the component for every new style -->
  {#key `${numberOfMaps}-${map.index}`}
    <div
      id={map.id}
      class={`map-label-container ${
        numberOfMaps === 2 ? `map-label-container-${map.index}` : ''
      }`}
      style={labelStyle}
    >
      <MapLabel
        index={map.index}
        mapIdIndex={mapId}
        name={map.name}
        onClose={removeMap}
        disableClose={numberOfMaps <= 1}
        mapState={mapStateProps}
        {stylesheet}
        onMapState={handleMapMove}
      />
    </div>
  {/key}
</div>

<style>
  .map-container {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .map {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .map-label-container {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: 1em;
    margin-bottom: 2em;
    width: auto;
    max-width: calc(100% - 6em);
    min-width: 300px;
  }

  .highlight-diff {
    filter: invert(1) opacity(0.5);
  }

  .screenshot-label {
    background-color: white;
    position: absolute;
    z-index: 1000;
    margin: 0.25rem;
    width: calc(100% - 1.5rem);
    padding: 0.5rem;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .screenshot-text {
    text-align: center;
  }

  .screenshot-label-bold {
    font-weight: bold;
  }

  .screenshot-label-transparent {
    display: none;
  }
</style>
