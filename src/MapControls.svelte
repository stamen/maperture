<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { Geocoder } from '@beyonk/svelte-mapbox';
  import { round } from './math';
  const dispatch = createEventDispatcher();

  export let bearing;
  export let center;
  export let mapboxGlAccessToken;
  export let pitch;
  export let zoom;
  export let showCollisions;

  // TODO style
  // TODO add view modes

  $: {
    dispatch('mapState', {
      options: { showCollisions }
    });
  }

  let copied = false;

  let formattedLocation = '';

  $: {
    let locationParts = [
      round(zoom, 2),
      round(center.lat, 3),
      round(center.lng, 3)
    ];

    if (pitch || bearing) {
      locationParts = locationParts.concat([
	round(pitch, 1),
	round(bearing, 1)
      ]);
    }
    formattedLocation = locationParts.join('/');
  }

  let changingState = false;
  let stateInput = '';

  const handleMapStateChangeStart = () => {
    changingState = true;
    stateInput = [
      round(zoom, 2),
      round(center.lat, 3),
      round(center.lng, 3),
      round(pitch, 1),
      round(bearing, 1)
    ].join('/');
  };

  const handleMapStateChangeCancel = () => {
    changingState = false;
  };

  const handleMapStateChangeEnd = () => {
    changingState = false;
    copied = false;

    const [zoom, lat, lng, pitch, bearing] = stateInput.split('/');
    const options = { mapStateUpdateOrigin: 'controls' };
    if (zoom !== undefined) options.zoom = +zoom;
    if (lat !== undefined && lng !== undefined) options.center = [+lng, +lat];
    if (pitch !== undefined) options.pitch = +pitch;
    if (bearing !== undefined) options.bearing = +bearing;
    dispatch('mapState', { options });
  };

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

  const handleLocationCopy = () => {
    copied = true;
    navigator.clipboard.writeText(formattedLocation);
  };
</script>

<div class="map-controls">
  <div class="control-section">
    {#if changingState}
      <div class="state-record map-view-input-container">
	<label>enter zoom/lat/lng[/pitch/bearing]</label>
	<input type="text" class="map-view-input"
	  bind:value={stateInput}
	  on:keydown={e => {
	    if (e.key === 'Enter') handleMapStateChangeEnd()
	    if (e.key === 'Escape') handleMapStateChangeCancel()
	  }}
	/>
      </div>
    {:else}
      <div class="map-state-container">
	<div class="map-state">{formattedLocation}</div>
	<div class="location-actions">
	  <div class="location-button" on:click={handleMapStateChangeStart}>change</div>
	  <div class="location-button" on:click={handleLocationCopy}>
	    {copied ? "copied" : "copy"}
	  </div>
	</div>
      </div>
    {/if}
  </div>

  <div class="control-section">
    <Geocoder
      accessToken={mapboxGlAccessToken}
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

  .map-state-container {
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .map-state {
    display: flex;
    justify-content: space-around;
  }

  .state-record {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .location-actions {
    display: flex;
    flex-direction: row;
  }

  .location-button {
    font-size: 0.75em;
    margin: 0 0.5em;
  }
</style>
