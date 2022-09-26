<script>
  import { createEventDispatcher, tick } from 'svelte';
  import Button from './inputs/Button.svelte';
  import { round } from '../math';

  export let bearing;
  export let center;
  export let pitch;
  export let zoom;

  const dispatch = createEventDispatcher();
  let copied = false;
  let changingState = false;
  let formattedLocation = '';
  let stateInput = '';
  let stateInputElement;

  $: lat = center.lat;
  $: lng = center.lng;

  const setLocation = (lat, lng, zoom, pitch, bearing) => {
    let locationParts = [round(zoom, 2), round(lat, 3), round(lng, 3)];

    if (pitch || bearing) {
      locationParts.push(round(pitch, 1));
      locationParts.push(round(bearing, 1));
    }
    formattedLocation = locationParts.join('/');
    copied = false;
  };

  const handleCopy = () => {
    copied = true;
    navigator.clipboard.writeText(formattedLocation);
  };

  const handleChangeStart = async () => {
    changingState = true;
    stateInput = formattedLocation;

    // Focus on text input, but first wait for element to render
    await tick();
    stateInputElement.focus();
  };

  const handleChangeCancel = () => {
    changingState = false;
  };

  const handleChangeEnd = () => {
    changingState = false;
    copied = false;

    const [zoom, lat, lng, pitch, bearing] = stateInput.split('/');
    const options = { mapStateUpdateOrigin: 'controls' };
    if (zoom !== undefined) options.zoom = +zoom;
    if (lat !== undefined && lng !== undefined)
      options.center = {
        lng: +lng,
        lat: +lat,
      };
    if (pitch !== undefined) options.pitch = +pitch;
    if (bearing !== undefined) options.bearing = +bearing;
    dispatch('mapState', { options });
  };

  $: setLocation(lat, lng, zoom, pitch, bearing);
</script>

<div>
  {#if changingState}
    <div class="state-record">
      <label>enter zoom/lat/lng[/pitch/bearing]</label>
      <input
        type="text"
        bind:value={stateInput}
        on:keydown={e => {
          if (e.key === 'Enter') handleChangeEnd();
          if (e.key === 'Escape') handleChangeCancel();
        }}
        on:focus={e => e.target.select()}
        bind:this={stateInputElement}
      />
    </div>
  {:else}
    <div class="map-state-container">
      <div class="map-state" on:click={handleCopy}>{formattedLocation}</div>
      <div class="location-actions">
        <div>
          <Button on:click={handleChangeStart}>change</Button>
        </div>
        <div>
          <Button on:click={handleCopy}>
            {copied ? 'copied' : 'copy'}
          </Button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .map-state-container {
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  .map-state {
    cursor: pointer;
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

  .location-actions > div {
    margin: 0 0.5em;
  }
</style>
