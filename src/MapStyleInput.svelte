<script>
  export let name;
  export let style;

  let changing = false;
</script>

<div class="map-style-input">
  <div class="map-label">{name}</div>
  <div class="change-style" on:click={() => changing = !changing}>change</div>
  {#if changing}
    <div class="change-section">Change style here</div>
  {/if}
</div>

<style>
  .map-style-input {
    position: relative;
  }

  .map-label {
    text-align: center;
  }

  .change-style {
    cursor: pointer;
    font-size: 0.5em;
    font-weight: normal;
    margin-left: 1em;
  }

  .change-section {
    background: white;
    position: absolute;
    top: 2em;
    z-index: 1000;
  }
</style>
