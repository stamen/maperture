<script>
  import { createEventDispatcher } from 'svelte';
  import GoogleMap from './GoogleMap.svelte';
  import MapboxGlMap from './MapboxGlMap.svelte';
  import MapLabel from './MapLabel.svelte';

  const dispatch = createEventDispatcher();

  export let index;
  export let name;
  export let type;
  export let url;
  export let style;
  export let id;
  export let branch;

  let MapComponent;

  console.log(id, type, style);

  $: switch (type) {
    case 'google':
      MapComponent = GoogleMap;
      break;
    case 'mapbox-gl':
    default:
      MapComponent = MapboxGlMap;
  }

  const handleMapStyleUpdate = event => {
    dispatch('mapStyleState', { ...event.detail, index });
  };
</script>

<div class="map">
  <svelte:component
    this={MapComponent}
    url={style || url}
    id={`${id}-${index}`}
    {...$$restProps}
    on:mapMove
  />

  <div class={`map-label-container map-label-container-${index}`}>
    <MapLabel {name} {url} {branch} on:mapStyleUpdate={handleMapStyleUpdate} />
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
