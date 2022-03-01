<script>
  export let style;

  let changing = false;
</script>

<div class="map-style-input">
  <button on:click={() => changing = !changing}>
    change style
  </button>

  {#if changing}
    <div>Change style here (not yet implmented)</div>
  {/if}
</div>

<style>
  .map-style-input {
    position: relative;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.75em;
    font-weight: normal;
    padding: 0;
    margin: 0;
  }
</style>
