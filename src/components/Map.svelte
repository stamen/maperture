<script>
  import { maps as mapsStore } from '../stores';
  import GoogleMap from './GoogleMap.svelte';
  import MapboxGlMap from './MapboxGlMap.svelte';
  import MapLabel from './MapLabel.svelte';

  export let index;

  let map;
  let MapComponent;

  mapsStore.subscribe(value => (map = value[index]));

  $: switch (map.type) {
    case 'google':
      MapComponent = GoogleMap;
      break;
    case 'mapbox-gl':
    default:
      MapComponent = MapboxGlMap;
  }
</script>

<div class="map">
  <svelte:component
    this={MapComponent}
    {index}
    id={`${map.id}-${index}`}
    mapStyle={map}
    {...$$restProps}
    on:mapMove
  />

  <div class={`map-label-container map-label-container-${index}`}>
    <MapLabel {index} name={map.name} />
  </div>
</div>

<style>
  .map {
    height: 100%;
    width: 100%;
  }

  .map-label-container {
    position: absolute;
    left: 1em;
    bottom: 2em;
  }

  .map-label-container-1 {
    left: unset;
    right: 1em;
  }
</style>
