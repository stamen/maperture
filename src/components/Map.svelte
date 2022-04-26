<script>
  import GoogleMap from './GoogleMap.svelte';
  import MapboxGlMap from './MapboxGlMap.svelte';
  import MapLabel from './MapLabel.svelte';
  import { maps as mapsStore } from '../stores';

  export let map;
  export let numberOfMaps;
  let MapComponent;

  $: switch (map.type) {
    case 'google':
      MapComponent = GoogleMap;
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
    {...$$restProps}
    on:mapMove
  />

  <div
    id={map.id}
    class={`map-label-container ${
      numberOfMaps === 2 ? `map-label-container-${map.index}` : ''
    }`}
  >
    <MapLabel
      index={map.index}
      name={map.name}
      onClose={removeMap}
      disableClose={numberOfMaps <= 2}
    />
  </div>
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
</style>
