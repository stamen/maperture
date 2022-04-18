<script>
  import GoogleMap from './GoogleMap.svelte';
  import MapboxGlMap from './MapboxGlMap.svelte';
  import MapLabel from './MapLabel.svelte';

  export let map;
  let MapComponent;

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
    index={map.index}
    id={`${map.id}-${map.index}`}
    mapStyle={map}
    {...$$restProps}
    on:mapMove
  />

  <div class={`map-label-container map-label-container-${map.index}`}>
    <MapLabel index={map.index} name={map.name} />
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
