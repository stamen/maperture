<script>
  import { createEventDispatcher } from 'svelte';
  import { Geocoder } from '@beyonk/svelte-mapbox';
  import { checkMapState } from '../map-state-utils';
  import MapLocationControl from './MapLocationControl.svelte';
  import ViewModeControl from './ViewModeControl.svelte';
  import MapLocationDropdown from './MapLocationDropdown.svelte';
  import { maps as mapsStore } from '../stores';

  export let bearing;
  export let center;
  export let mapboxGlAccessToken;
  export let pitch;
  export let showCollisions;
  export let viewMode;
  export let showBoundaries;
  export let zoom;

  const dispatch = createEventDispatcher();
  let maps = [];
  let mapState;
  let mapStateValidationMessages = [];

  mapsStore.subscribe(value => (maps = value));
  $: mapState = { bearing, center, pitch, zoom };
  $: mapStateValidationMessages = checkMapState(mapState, maps);

  // When showCollisions or showBoundaries changes, update map state
  $: dispatch('mapState', { options: { showCollisions, showBoundaries } });

  const handleGeocoderResult = ({ detail }) => {
    const { result } = detail;
    const options = {
      center: {
        lat: result.center[1],
        lng: result.center[0],
      },
      zoom: 17,
    };
    if (result.bbox) {
      options.zoom = 14;
    }
    dispatch('mapState', { options });
  };
</script>

<div class="map-controls">
  <div class="control-row">
    <div class="control-section">
      <MapLocationControl on:mapState {...mapState} />
    </div>

    <div class="control-section">
      <ViewModeControl on:viewMode mode={viewMode} />
    </div>

    <div class="control-section">
      <Geocoder
        accessToken={mapboxGlAccessToken}
        geocoder={null}
        on:result={handleGeocoderResult}
      />
    </div>

    <div class="control-section">
      <MapLocationDropdown on:mapState {...mapState} />
    </div>

    <div class="control-section">
      <div class="checkboxes">
        <label>
          <span>Label Collisions</span>
          <input type="checkbox" bind:checked={showCollisions} />
        </label>
        <label>
          <span>Tile Boundaries</span>
          <input type="checkbox" bind:checked={showBoundaries} />
        </label>
      </div>
    </div>
  </div>
  {#if mapStateValidationMessages.length > 0}
    <div class="validation-messages">
      {#each mapStateValidationMessages as m}
        <div class={`validation-message-${m.type}`}>{m.message}</div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .map-controls {
    background: white;
    border-bottom: 1px solid #eee;
    box-shadow: 0 0 10px 2px rgb(0 0 0 / 10%);
    padding: 1em;
    pointer-events: all;
  }

  .control-row {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .control-section {
    margin: 0 1em;
    display: flex;
  }

  .checkboxes {
    text-align: right;
  }

  .validation-messages {
    font-size: 0.8em;
    margin-top: 1.5em;
  }

  .validation-message-warning {
    color: #c1810c;
  }
</style>
