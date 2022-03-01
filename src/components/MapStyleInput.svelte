<script>
  import Button from './inputs/Button.svelte';

  export let style;

  let changing = false;
</script>

<div class="map-style-input">
  <Button on:click={() => changing = !changing}>
    change style
  </Button>

  {#if changing}
    <div>Change style here (not yet implmented)</div>
  {/if}
</div>

<style>
</style>
