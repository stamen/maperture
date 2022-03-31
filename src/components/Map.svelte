<script>
  import { createEventDispatcher } from 'svelte';
  import MapboxGlMap from './MapboxGlMap.svelte';
  import MapLabel from './MapLabel.svelte';

  const dispatch = createEventDispatcher();

  export let index;
  export let name;
  export let type;
  export let url;
  export let style;

  let MapComponent;

  switch (type) {
    case 'mapbox-gl':
    default:
      // This is currently the only map component implemented
      MapComponent = MapboxGlMap;
  }

  const handleMapStyleUpdate = event => {
    const { url, style } = event.detail;
    dispatch('mapStyleState', { url, style, index });
  };
</script>

<div class="map">
  <svelte:component
    this={MapComponent}
    url={style || url}
    {...$$restProps}
    on:mapMove
  />

  <div class={`map-label-container map-label-container-${index}`}>
    <MapLabel {name} {url} on:mapStyleUpdate={handleMapStyleUpdate} />
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
