<script>
  import { createEventDispatcher } from 'svelte';
  import { faXmark } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa/src/fa.svelte';
  import MapStyleInputWrapper from './MapStyleInputWrapper.svelte';
  import MapLocationControl from './MapLocationControl.svelte';
  import {
    showDisplays as showDisplaysStore,
    linkLocations as linkLocationsStore,
  } from '../stores';
  export let index;
  export let name;
  export let onClose;
  export let disableClose;
  export let mapState;
  export let highlightDifferences = false;
  export let showHighlightDifferences = false;

  const dispatch = createEventDispatcher();

  let locationProps;

  $: ({ showBoundaries, showCollisions, ...locationProps } = mapState);

  const toggleHighlightDifferences = () => {
    dispatch('toggleHighlightDifferences');
  };
</script>

{#if $showDisplaysStore}
  <div class="map-label">
    <button class="close-button" on:click={onClose} disabled={disableClose}>
      <Fa icon={faXmark} />
    </button>
    <div class="style-input-container">
      <div class="map-name">{name}</div>
      {#if showHighlightDifferences}
        <label>
          <input
            type="checkbox"
            bind:checked={highlightDifferences}
            on:change={toggleHighlightDifferences}
          />
          <span>Diff</span>
        </label>
      {/if}
    </div>
    <div class="options-container">
      <MapStyleInputWrapper {index} />
      {#if !$linkLocationsStore && Object.keys(locationProps).length}
        <div class="location-control">
          <MapLocationControl on:mapState {...locationProps} />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .map-label {
    background: white;
    box-shadow: 0 0 10px 2px rgb(0 0 0 / 10%);
    padding: 1em;
    display: flex;
    flex-direction: column;
    min-width: 240px;
  }

  .map-name {
    font-size: 1.25em;
    font-weight: bold;
    margin-right: 12px;
  }

  .close-button {
    background-color: transparent;
    border: none;
    position: absolute;
    top: 0;
    right: 0;
    padding: 6px;
  }

  .close-button:hover {
    cursor: pointer;
    color: black;
  }

  .close-button:disabled {
    cursor: not-allowed;
    color: lightgray;
  }

  .options-container {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
  }

  .location-control {
    margin-top: 12px;
    display: flex;
    justify-content: left;
  }

  .style-input-container {
    display: flex;
    align-items: center;
  }
</style>
