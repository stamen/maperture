<script>
  import deepEqual from 'deep-equal';
  import { createEventDispatcher } from 'svelte';

  import MapboxGlMap from './MapboxGlMap.svelte';
  import MapLabel from './MapLabel.svelte';
  import MapStyleInput from './MapStyleInput.svelte';

  export let index;
  export let name;
  export let sliderPosition;
  export let style;
  export let type;

  let width;
  let height;

  let MapComponent;

  switch (type) {
    case 'mapbox-gl':
    default:
      // This is currently the only map component implmented
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
    style={style}
    {...$$restProps}
    on:mapMove
  />

  <div class={`map-label-container map-label-container-${index}`}>
    <MapLabel name={name} style={style} />
  </div>

  <img
    class="phone-outline"
    src="img/motog-outline-small.png"
    alt="Phone outline"
  />
</div>

<style>
  .phone-outline {
    display: none;
  }

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

  .map {
    height: 100%;
  }

  :global(.map-container .mapboxgl-control-container *) {
    pointer-events: none;
    user-select: none;
  }
</style>
