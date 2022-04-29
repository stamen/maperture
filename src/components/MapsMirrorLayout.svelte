<script>
  import Map from './Map.svelte';

  export let maps;
  export let mapState;

  let rows = [];
  let numberOfMaps = 0;

  $: rows = [maps];

  $: numberOfMaps = maps.length;

  $: {
    if (maps.length) {
      const numOfRows = Math.round(Math.sqrt(numberOfMaps));
      const mapsPerRow = Math.floor(numberOfMaps / numOfRows);
      let mapArr = JSON.parse(JSON.stringify(maps));
      let nextRows = [];
      while (mapArr.length) {
        nextRows.push(mapArr.slice(0, mapsPerRow));
        mapArr = mapArr.slice(mapsPerRow);
      }
      rows = nextRows;
    }
  }
</script>

<div class="maps mirror">
  {#each rows as maps}
    <div class="row">
      {#each maps as map}
        <div class="map-container">
          <Map {map} {...mapState} {numberOfMaps} on:mapMove />
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
