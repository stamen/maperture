<script>
  import { shortcut } from '../shortcut';
  import {
    faLink,
    faLinkSlash,
    faCamera,
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa/src/fa.svelte';
  import { Geocoder } from '@beyonk/svelte-mapbox';
  import { getMapStateMessages } from '../map-state-utils';
  import { captureMapsScreenshot } from '../screenshot';
  import ViewModeControl from './ViewModeControl.svelte';
  import Tooltip from './Tooltip.svelte';
  import MapLocationControl from './MapLocationControl.svelte';
  import MapLocationDropdown from './MapLocationDropdown.svelte';
  import {
    maps as mapsStore,
    showDisplays as showDisplaysStore,
    linkLocations as linkLocationsStore,
    mapLocations as mapLocationsStore,
  } from '../stores';

  let {
    bearing,
    center,
    mapboxGlAccessToken,
    pitch,
    zoom,
    showCollisions: showCollisionsProp,
    showBoundaries: showBoundariesProp,
    showDiff: showDiffProp,
    viewMode,
    onMapState,
    onViewMode,
  } = $props();

  let showCollisions = $state(showCollisionsProp);
  let showBoundaries = $state(showBoundariesProp);
  let showDiff = $state(showDiffProp);

  // Diff-highlighting only applies in swipe mode. Derive the effective value
  // rather than reactively writing showDiff back to itself when leaving
  // swipe — see the note on handleMapState in App.svelte for why avoiding
  // that pattern matters here.
  let effectiveShowDiff = $derived(viewMode === 'swipe' ? showDiff : false);

  let maps = $state([]);
  mapsStore.subscribe(value => (maps = value));

  let mapStateValidationMessages = $derived(
    getMapStateMessages({ bearing, center, pitch, zoom }, maps),
  );

  // Called directly from user interactions below (checkboxes, keyboard
  // shortcuts) rather than from an $effect watching this component's own
  // state — notifying the parent is a direct consequence of the user's
  // action, not a reaction to state that changed for some other reason.
  const notifyMapState = () => {
    onMapState({
      options: {
        showCollisions,
        showBoundaries,
        showDiff: effectiveShowDiff,
      },
    });
  };

  const setShowCollisions = value => {
    showCollisions = value;
    notifyMapState();
  };

  const setShowBoundaries = value => {
    showBoundaries = value;
    notifyMapState();
  };

  const setShowDiff = value => {
    showDiff = value;
    notifyMapState();
  };

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
    onMapState({ options });
  };

  const downloadScreenshot = () => captureMapsScreenshot(viewMode);

  const addMapPane = () => {
    mapsStore.update(current => {
      let lastMap = current[current.length - 1];
      lastMap = { ...lastMap, index: lastMap.index + 1 };
      return current.concat([lastMap]);
    });
    if (!$linkLocationsStore) {
      mapLocationsStore.update(value => [
        ...value,
        { ...value[value.length - 1] },
      ]);
    }
  };

  const toggleHideUi = () => {
    showDisplaysStore.update(value => !value);
  };

  const toggleLinkLocations = () => {
    linkLocationsStore.update(value => !value);
  };

  function onKeyDown(e) {
    if (e.target.tagName.toLowerCase() === 'input') return;
    if (e.key === 'c' || e.key === 'C') setShowCollisions(!showCollisions);
    if (e.key === 't' || e.key === 'T') setShowBoundaries(!showBoundaries);
    if (e.key === 'd' || e.key === 'D') setShowDiff(!effectiveShowDiff);
  }
</script>

{#if $showDisplaysStore}
  <div class="map-controls">
    <div class="control-row">
      <div class="control-section">
        <div
          class="link-button"
          style="margin-right: 6px"
          title={$linkLocationsStore ? 'Unlink locations' : 'Link locations'}
          onclick={toggleLinkLocations}
          onkeydown={() => false}
          role="button"
          tabindex="0"
        >
          <Fa icon={$linkLocationsStore ? faLink : faLinkSlash} />
        </div>
        {#if $linkLocationsStore}
          <MapLocationControl {bearing} {center} {pitch} {zoom} {onMapState} />
        {/if}
      </div>

      <div class="control-section">
        <ViewModeControl mode={viewMode} mapsNum={maps.length} {onViewMode} />
      </div>

      <div class="control-section">
        {#if mapboxGlAccessToken}
          <Geocoder
            accessToken={mapboxGlAccessToken}
            geocoder={null}
            on:result={handleGeocoderResult}
          />
        {/if}
      </div>

      <div class="control-section">
        <MapLocationDropdown {bearing} {center} {pitch} {zoom} {onMapState} />
      </div>

      <div class="control-section">
        <div class="checkboxes">
          <label class="checkbox-container">
            <span class="checkbox-label"
              >Label <span class="hotkey">C</span>ollisions</span
            >
            <input
              type="checkbox"
              checked={showCollisions}
              onchange={e => setShowCollisions(e.target.checked)}
            />
          </label>
          <label class="checkbox-container">
            <span class="checkbox-label"
              ><span class="hotkey">T</span>ile Boundaries</span
            >
            <input
              type="checkbox"
              checked={showBoundaries}
              onchange={e => setShowBoundaries(e.target.checked)}
            />
          </label>
          {#if viewMode === 'swipe'}
            <Tooltip title="Highlights visual differences between two styles.">
              <label class="checkbox-container">
                <span class="checkbox-label"
                  >Highlight <span class="hotkey">D</span>ifferences</span
                >
                <input
                  type="checkbox"
                  checked={effectiveShowDiff}
                  onchange={e => setShowDiff(e.target.checked)}
                />
              </label>
            </Tooltip>
          {/if}
        </div>
      </div>
      <div class="control-section">
        <div class="buttons">
          <button
            style="margin-right: 6px"
            onclick={addMapPane}
            disabled={maps.length >= 8}
            title={maps.length >= 8 ? 'Maximum of 8 maps allowed.' : ''}
          >
            + Add map
          </button>
          <button
            onclick={downloadScreenshot}
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
          onclick={toggleHideUi}
          title="Hide UI"
          use:shortcut={{
            shift: true,
            control: true,
            code: 'KeyF',
            callback: toggleHideUi,
          }}
        >
          Hide UI
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
    onclick={toggleHideUi}
    use:shortcut={{
      shift: true,
      control: true,
      code: 'KeyF',
      callback: toggleHideUi,
    }}
    title="Show UI"
  >
    Show UI
  </button>
{/if}

<svelte:window onkeydown={onKeyDown} />

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

  .validation-messages {
    font-size: 0.8em;
    margin-top: 1.5em;
  }

  .validation-message-warning {
    color: #c1810c;
  }

  .checkboxes {
    text-align: right;
    font-size: 12px;
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    justify-content: right;
  }

  .checkbox-label {
    margin-right: 6px;
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

  .hotkey {
    text-decoration: underline;
    font-weight: 500;
  }
</style>
