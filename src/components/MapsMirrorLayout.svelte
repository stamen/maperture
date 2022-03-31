<script>
  import Map from './Map.svelte';

  export let maps;
  export let mapState;

  let rows = [];

  // Just one row for now, will split into more rows once we can have more than two map panes
  $: rows = [maps];
</script>

<div class="maps mirror">
  {#each rows as maps}
    <div class="row">
      {#each maps as map}
        <div class="map-container">
          <Map {...map} {...mapState} on:mapMove on:mapStyleState />
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .maps {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100%;
    --border: 1px solid black;
  }

  .row {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    border-bottom: var(--border);
  }

  .row:last-of-type {
    border-bottom: none;
  }

  .map-container {
    flex-grow: 1;
    border-right: var(--border);
  }

  .map-container:last-of-type {
    border-right: none;
  }
</style>
