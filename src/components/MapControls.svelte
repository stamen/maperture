<script>
  import { createEventDispatcher } from 'svelte';
  import { Geocoder } from '@beyonk/svelte-mapbox';
  import MapLocationControl from './MapLocationControl.svelte';

  export let bearing;
  export let center;
  export let mapboxGlAccessToken;
  export let pitch;
  export let showCollisions;
  export let zoom;

  const dispatch = createEventDispatcher();
  let mapLocation;

  $: mapLocation = { bearing, center, pitch, zoom };

  // When showCollisions changes, update map state
  $: dispatch('mapState', { options: { showCollisions } });

  const handleGeocoderResult = ({ detail }) => {
    const { result } = detail;
    const options = {
      center: result.center,
      zoom: 17
    };
    if (result.bbox) {
      options.zoom = 14;
    }
    dispatch('mapState', { options });
  };
</script>

<div class="map-controls">
  <div class="control-section">
    <MapLocationControl on:mapState {...mapLocation} />
  </div>

  <div class="control-section">
    <Geocoder
      accessToken={mapboxGlAccessToken}
      geocoder={null}
      on:result={handleGeocoderResult}
    />
  </div>

  <div class="control-section">
    <label>
      <span>show label collisions?</span>
      <input type="checkbox" bind:checked={showCollisions} />
    </label>
  </div>
</div>

<style>
  .map-controls {
    align-items: center;
    background: white;
    border-bottom: 1px solid #eee;
    box-shadow: 0 0 10px 2px rgb(0 0 0 / 10%);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 1em;
    pointer-events: all;
  }

  .control-section {
    margin: 0 1em;
  }
</style>