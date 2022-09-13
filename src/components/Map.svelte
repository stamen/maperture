<script>
  import GoogleMap from './GoogleMap.svelte';
  import MapLibreMap from './MapLibreMap.svelte';
  import MapboxGlMap from './MapboxGlMap.svelte';
  import MapLabel from './MapLabel.svelte';
  import { maps as mapsStore } from '../stores';

  export let map;
  export let numberOfMaps;
  export let themeLabel = '';

  let MapComponent;

  $: switch (map.type) {
    case 'google':
      MapComponent = GoogleMap;
      break;
    case 'maplibre-gl':
      MapComponent = MapLibreMap;
      break;
    case 'mapbox-gl':
    default:
      MapComponent = MapboxGlMap;
  }

  const removeMap = () => {
    mapsStore.update(current => {
      const next = current
        .filter((m, i) => i !== map.index)
        .map((item, i) => ({ ...item, index: i }));
      return next;
    });
  };
</script>

<div class="map">
  <svelte:component
    this={MapComponent}
    index={map.index}
    id={`${map.id}-${map.index}`}
    mapStyle={map}
    {numberOfMaps}
    {...$$restProps}
    on:mapMove
  />
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
