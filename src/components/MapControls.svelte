<script>
  import { shortcut } from '../shortcut';
  import html2canvas from 'html2canvas';
  import {
    faCamera,
    faPlus,
    faExpand,
    faCompress,
    faLink,
    faLinkSlash,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa/src/fa.svelte';
  import { createEventDispatcher } from 'svelte';
  import { Geocoder } from '@beyonk/svelte-mapbox';
  import { getMapStateMessages } from '../map-state-utils';
  import MapLocationControl from './MapLocationControl.svelte';
  import ViewModeControl from './ViewModeControl.svelte';
  import MapLocationDropdown from './MapLocationDropdown.svelte';
  import {
    maps as mapsStore,
    showDisplays as showDisplaysStore,
    linkLocations as linkLocationsStore,
    mapLocations as mapLocationsStore,
  } from '../stores';

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
  $: mapStateValidationMessages = getMapStateMessages(mapState, maps);

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

  const addMapPane = () => {
    mapsStore.update(current => {
      let lastMap = current[current.length - 1];
      lastMap = { ...lastMap, index: lastMap.index + 1 };
      const next = current.concat([lastMap]);
      return next;
    });
    if (!$linkLocationsStore) {
      mapLocationsStore.update(value => {
        return [...value, { ...value[value.length - 1], index: value.length }];
      });
    }
  };

  const downloadScreenshot = () => {
    const mapsView = document.getElementsByClassName('maps')[0];

    const ignoreElements = el => {
      if (el.className && typeof el.className === 'string') {
        return el.className.includes('map-label');
      }
      return false;
    };

    html2canvas(mapsView, { ignoreElements }).then(canvas => {
      canvas.toBlob(blob =>
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      );
    });
  };

  const toggleHideUi = () => {
    showDisplaysStore.update(value => !value);
  };

  const toggleLinkLocations = () => {
    let linkedLocations;
    linkLocationsStore.update(value => {
      const nextValue = !value;
      linkedLocations = nextValue;
      return nextValue;
    });
    if (!linkedLocations) {
      const mapLocations = maps.map(m => ({
        index: m.index,
        location: mapState,
      }));
      mapLocationsStore.set(mapLocations);
    } else {
      mapLocationsStore.set(null);
    }
  };
</script>

{#if $showDisplaysStore}
  <div class="map-controls">
    <div class="control-row">
      <div class="control-section">
        <div
          class="link-button"
          style="margin-right: 6px"
          title={$linkLocationsStore ? 'Unlink locations' : 'Link locations'}
          on:click={toggleLinkLocations}
        >
          <Fa icon={$linkLocationsStore ? faLink : faLinkSlash} />
        </div>
        {#if $linkLocationsStore}
          <MapLocationControl on:mapState {...mapState} />{/if}
      </div>

      <div class="control-section">
        <ViewModeControl on:viewMode mode={viewMode} mapsNum={maps.length} />
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
      <div class="control-section">
        <div class="buttons">
          <button
            style="margin-right: 6px"
            on:click={addMapPane}
            disabled={maps.length >= 8}
            title={maps.length >= 8 ? 'Maximum of 8 maps allowed.' : ''}
          >
            <Fa icon={faPlus} /> Add map
          </button>
          <button
            on:click={downloadScreenshot}
            disabled={viewMode === 'swipe'}
            title={viewMode === 'swipe'
              ? 'Must be in phone or mirror mode to screenshot.'
              : 'Copy image to clipboard'}
          >
            <Fa icon={faCamera} />
            Copy image
          </button>
        </div>
      </div>
      <div class="control-section">
        <button
          class="fullscreen-btn"
          on:click={toggleHideUi}
          title="Hide UI"
          use:shortcut={{
            shift: true,
            control: true,
            code: 'KeyF',
            callback: toggleHideUi,
          }}
        >
          <Fa icon={faExpand} />
        </button>
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
{:else}
  <button
    class="fullscreen-btn show-ui"
    on:click={toggleHideUi}
    use:shortcut={{
      shift: true,
      control: true,
      code: 'KeyF',
      callback: toggleHideUi,
    }}
    title="Show UI"
  >
    <Fa icon={faCompress} />
  </button>
{/if}

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

  .buttons {
    display: flex;
    flex-direction: row;
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

  .fullscreen-btn {
    padding-left: 12px;
    padding-right: 12px;
  }

  .show-ui {
    position: absolute;
    top: 12px;
    right: 12px;
    margin-top: -1em;
    pointer-events: all;
  }

  .link-button:hover {
    color: #666;
    cursor: pointer;
  }
</style>
