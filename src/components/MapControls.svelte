<script>
  import { shortcut } from '../shortcut';
  import ViewModeControl from './ViewModeControl.svelte';
  import {
    maps as mapsStore,
    showDisplays as showDisplaysStore,
    linkLocations as linkLocationsStore,
    mapLocations as mapLocationsStore,
  } from '../stores';

  // TODO(svelte-5-port): geocoder search, screenshot/copy-image, and the
  // per-map location controls (MapLocationControl/MapLocationDropdown) are
  // deferred along with the rest of the style/location UI — see MapLabel's
  // TODO. This keeps only the controls that are already fully wired up
  // (view mode, collisions/boundaries/diff toggles, add map, link/unlink,
  // hide UI).
  let {
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
        <button class="link-button" onclick={toggleLinkLocations}>
          {$linkLocationsStore ? 'Unlink locations' : 'Link locations'}
        </button>
      </div>

      <div class="control-section">
        <ViewModeControl mode={viewMode} mapsNum={maps.length} {onViewMode} />
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
          {/if}
        </div>
      </div>
      <div class="control-section">
        <button
          onclick={addMapPane}
          disabled={maps.length >= 8}
          title={maps.length >= 8 ? 'Maximum of 8 maps allowed.' : ''}
        >
          + Add map
        </button>
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
