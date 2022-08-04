<script>
  import { faXmark } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa/src/fa.svelte';
  import MapStyleInputWrapper from './MapStyleInputWrapper.svelte';

  export let index;
  export let name;
  export let onClose;
  export let disableClose;
</script>

<div class="map-label">
  <button class="close-button" on:click={onClose} disabled={disableClose}>
    <Fa icon={faXmark} />
  </button>
  <div class="map-name">{name}</div>
  <MapStyleInputWrapper {index} />
</div>

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
</style>
