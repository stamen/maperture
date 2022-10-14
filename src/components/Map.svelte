<script>
  import { createEventDispatcher } from 'svelte';
  import GoogleMap from './GoogleMap.svelte';
  import GlMap from './GlMap.svelte';
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
  export let themeLabel = '';

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

  $: mapType = map.type;

  const setProps = (id, num) => {
    props = {
      id,
      mapStyle: map,
      numberOfMaps: num,
    };
  };

  const setMapComponent = mapType => {
    switch (mapType) {
      case 'google':
        MapComponent = GoogleMap;
        break;
      case 'maplibre-gl':
        MapComponent = GlMap;
        props.mapType = mapType;
        break;
      case 'mapbox-gl':
      default:
        MapComponent = GlMap;
        props.mapType = mapType;
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

  $: setMapComponent(mapType);

  $: mapStateProps = getMapStateProps($$restProps);
</script>

<div class="map">
  {#key mapType}
    <svelte:component
      this={MapComponent}
      {...props}
      {...mapStateProps}
      on:mapMove={handleMapMove}
    />
  {/key}
  <!-- Use the number of maps and index to reset map on adding and removing maps -->
  <!-- We don't want to use the map id here or we'll unnecessarily remount the component for every new style -->
  {#key `${numberOfMaps}-${map.index}`}
    <div
      id={map.id}
      class={`map-label-container ${
        numberOfMaps === 2 ? `map-label-container-${map.index}` : ''
      } ${themeLabel}`}
    >
      <MapLabel
        index={map.index}
        name={map.name}
        onClose={removeMap}
        disableClose={numberOfMaps <= 1}
        mapState={mapStateProps}
        on:mapState={handleMapMove}
      />
    </div>
  {/key}
</div>

<style>
  .map {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .map-label-container {
    position: absolute;
    right: 1em;
    bottom: 2em;
  }

  .map-label-container-0 {
    right: unset;
    left: 1em;
  }

  .map-label-offset {
    position: absolute;
    margin-top: 48px;
    left: 0;
    right: 0;
    bottom: unset;
  }

  .map-label-responsive {
    position: fixed;
  }
</style>
