<script>
  import MapStyleInput from './MapStyleInput.svelte';

  export let name;
  export let onChangeUrl;
</script>

<div class="map-label">
  <div class="map-name">{name}</div>
  <MapStyleInput {onChangeUrl} />
</div>

<style>
  .map-label {
    background: white;
    box-shadow: 0 0 10px 2px rgb(0 0 0 / 10%);
    padding: 1em;
    display: flex;
    flex-direction: column;
    min-width:240px;
  }

  .map-name {
    font-size: 1.25em;
    font-weight: bold;
  }
</style>
