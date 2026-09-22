<script>
  import { tick } from 'svelte';
  import Button from './inputs/Button.svelte';
  import { round } from '../math';

  let { bearing, center, pitch, zoom, onMapState } = $props();

  let changingState = $state(false);
  let stateInput = $state('');
  let stateInputElement;

  let lat = $derived(center.lat);
  let lng = $derived(center.lng);

  let formattedLocation = $derived.by(() => {
    const locationParts = [round(zoom, 2), round(lat, 5), round(lng, 5)];
    if (pitch || bearing) {
      locationParts.push(round(pitch, 1));
      locationParts.push(round(bearing, 1));
    }
    return locationParts.join('/');
  });

  // Reset the "copied" indicator whenever the location actually changes —
  // depends only on formattedLocation, never reads `copied` itself, so
  // there's nothing here that reads and writes its own state.
  let copied = $state(false);
  $effect(() => {
    formattedLocation;
    copied = false;
  });

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

  const validateInput = ({ zoom, lat, lng, pitch, bearing }) => {
    let isValid = true;

    const isNumber = [zoom, lat, lng, pitch, bearing]
      .filter(Boolean)
      .every(item => !isNaN(Number(item)));

    if (!isNumber) {
      isValid = false;
    }

    // zoom
    if (+zoom < 0 || +zoom > 24) {
      isValid = false;
    }
    // lat
    if (+lat < -90 || +lat > 90) {
      isValid = false;
    }
    // lng
    if (+lng < -180 || +lng > 180) {
      isValid = false;
    }
    // pitch
    if (pitch !== undefined && (+pitch < 0 || +pitch > 85)) {
      isValid = false;
    }
    // bearing
    if (bearing !== undefined && isNaN(+bearing)) {
      isValid = false;
    }

    return isValid;
  };

  const handleChangeEnd = () => {
    changingState = false;
    copied = false;

    const [zoom, lat, lng, pitch, bearing] = stateInput.split('/');

    const isValid = validateInput({ zoom, lat, lng, pitch, bearing });

    if (!isValid) return;

    const options = { mapStateUpdateOrigin: 'controls' };
    if (zoom !== undefined) options.zoom = +zoom;
    if (lat !== undefined && lng !== undefined)
      options.center = {
        lng: +lng,
        lat: +lat,
      };
    if (pitch !== undefined) options.pitch = +pitch;
    if (bearing !== undefined) options.bearing = +bearing;

    onMapState({ options });
  };
</script>

<div>
  {#if changingState}
    <div class="state-record">
      <input
        style="height:18px"
        type="text"
        bind:value={stateInput}
        onkeydown={e => {
          if (e.key === 'Enter') handleChangeEnd();
          if (e.key === 'Escape') handleChangeCancel();
        }}
        onfocus={e => e.target.select()}
        bind:this={stateInputElement}
      /><label class="input-label">enter zoom/lat/lng[/pitch/bearing]</label>
    </div>
  {:else}
    <div class="map-state-container">
      <div
        class="map-state"
        onclick={handleCopy}
        onkeydown={() => false}
        role="button"
        tabindex="0"
      >
        {formattedLocation}
      </div>
      <div class="location-actions">
        <div>
          <Button onclick={handleChangeStart}>change</Button>
        </div>
        <div>
          <Button onclick={handleCopy}>
            {copied ? 'copied' : 'copy'}
          </Button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .map-state-container {
    align-items: left;
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
    align-items: left;
  }

  .location-actions {
    display: flex;
    flex-direction: row;
  }

  .location-actions > div {
    margin: 0 0.5em 0 0;
  }

  .input-label {
    font-size: 0.75em;
    font-weight: normal;
    margin-top: 3px;
  }
</style>
