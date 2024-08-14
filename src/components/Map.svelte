<script>
  import { createEventDispatcher } from 'svelte';
  import GoogleMap from './GoogleMap.svelte';
  import GlMap from './GlMap.svelte';
  import LeafletMap from './LeafletMap.svelte';
  import TangramMap from './TangramMap.svelte';
  import MapLabel from './MapLabel.svelte';
  import {
    maps as mapsStore,
    linkLocations as linkLocationsStore,
    mapLocations as mapLocationsStore,
  } from '../stores';
  import { validateMapState } from '../map-state-utils';
  import isEqual from 'lodash.isequal';

  export let map;
  export let numberOfMaps;
  export let highlightDifferences = false;
  export let labelStyle = '';

  const dispatch = createEventDispatcher();

  let MapComponent;

  // Only use this when locations are unlinked
  $: localMapState = $mapLocationsStore?.[map.index] ?? {};

  let props = {};

  $: mapId = `${map.id}-${map.index}`;

  // Update stylesheet variable only if there's been actual changes
  let stylesheet = {};
  $: if (!isEqual(stylesheet, map?.style)) {
    stylesheet = map?.style;
  }

  $: mapRenderer = map.renderer;

  const setProps = (id, num) => {
    props = {
      id,
      mapStyle: map,
      numberOfMaps: num,
    };
    setMapComponent(mapRenderer);
  };

  const setMapComponent = mapRenderer => {
    switch (mapRenderer) {
      case 'google':
        MapComponent = GoogleMap;
        break;
      case 'leaflet':
        MapComponent = LeafletMap;
        break;
      case 'tangram':
        MapComponent = TangramMap;
        break;
      case 'maplibre-gl':
        MapComponent = GlMap;
        props.mapRenderer = mapRenderer;
        break;
      case 'mapbox-gl':
      default:
        MapComponent = GlMap;
        props.mapRenderer = mapRenderer;
    }
  };

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

  const handleMapMove = event => {
    if (!$linkLocationsStore) {
      const { options } = event.detail;
      mapLocationsStore.update(value => {
        return value.map((v, i) => (i === map.index ? options : v));
      });
    } else {
      dispatch('mapMove', event.detail);
    }
  };

  $: {
    // Add trigger for stylesheet changes for locally served styles
    stylesheet;
    setProps(mapId, numberOfMaps);
  }

  $: setMapComponent(mapRenderer);

  $: mapStateProps = getMapStateProps($$restProps);
</script>

<div class="map-container">
  <div class="screenshot-label-transparent">{map.name ?? map.id}</div>
  {#key mapRenderer}
    <div class="map" class:highlight-diff={highlightDifferences}>
      <svelte:component
        this={MapComponent}
        {...props}
        {...mapStateProps}
        on:mapMove={handleMapMove}
      />
    </div>
  {/key}
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
        name={map.name}
        onClose={removeMap}
        disableClose={numberOfMaps <= 1}
        mapState={mapStateProps}
        {stylesheet}
        on:mapState={handleMapMove}
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

  .screenshot-label-transparent {
    display: none;
  }
</style>
