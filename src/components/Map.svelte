<script>
  import MapboxGlMap from './MapboxGlMap.svelte';
  import MapLabel from './MapLabel.svelte';

  export let index;
  export let name;
  export let sliderPosition;
  export let type;
  export let url;

  let width;
  let height;
  let MapComponent;

  switch (type) {
    case 'mapbox-gl':
    default:
      // This is currently the only map component implemented
      MapComponent = MapboxGlMap;
  }
</script>

<div class="map-container" 
  bind:clientHeight={height}
  bind:clientWidth={width}
  style={sliderPosition ? `clip: rect(0px, ${width}px, ${height}px, ${sliderPosition}px)` : null}
>
  <svelte:component
    this={MapComponent}
    {url}
    {...$$restProps}
    on:mapMove
  />

  <div class={`map-label-container map-label-container-${index}`}>
    <MapLabel {name} {url} />
  </div>
</div>

<style>
  .map-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .map-label-container {
    position: absolute;
    left: 1em;
    bottom: 2em;
  }

  .map-label-container-1 {
    position: absolute;
    left: unset;
    right: 1em;
    bottom: 2em;
  }
</style>
