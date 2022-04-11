<script>
  import GoogleMap from './GoogleMap.svelte';
  import MapboxGlMap from './MapboxGlMap.svelte';
  import MapLabel from './MapLabel.svelte';

  export let id;
  export let index;
  export let name;
  export let type;
  export let options;

  let MapComponent;

  $: switch (type) {
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
    {options}
    id={`${id}-${index}`}
    {...$$restProps}
    on:mapMove
  />

  <div class={`map-label-container map-label-container-${index}`}>
    <MapLabel {index} {name} url={options.url} branch={options.branch} />
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
