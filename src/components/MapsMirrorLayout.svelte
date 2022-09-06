<script>
  import Map from './Map.svelte';

  export let maps;
  export let mapState;

  let sections = [];
  let numberOfMaps = 0;
  // When we have this many maps, the layout works
  // better as rows versus columns
  const rowExceptions = [2, 6];
  let rowOrColumn;

  $: sections = [maps];

  $: numberOfMaps = maps.length;

  $: if (numberOfMaps) {
    rowOrColumn = rowExceptions.includes(numberOfMaps) ? 'row' : 'column';
  }

  $: {
    if (maps.length) {
      const numOfSections = Math.round(Math.sqrt(numberOfMaps));
      const mapsPerSection = Math.floor(numberOfMaps / numOfSections);
      let mapArr = JSON.parse(JSON.stringify(maps));
      let nextSections = [];
      while (mapArr.length) {
        nextSections.push(mapArr.slice(0, mapsPerSection));
        mapArr = mapArr.slice(mapsPerSection);
      }
      sections = nextSections;
    }
  }
</script>

<div class={`mirror maps-${rowOrColumn}`}>
  {#each sections as maps}
    <div class={`section-${rowOrColumn}`}>
      {#each maps as map}
        <div class={`map-container-${rowOrColumn}`}>
          <Map {map} {...mapState} {numberOfMaps} on:mapMove />
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  /* COLUMN ORIENTATION */

  .maps-column {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    height: 100%;
    --border: 1px solid black;
  }

  .section-column {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    border-right: var(--border);
  }

  .section-column:last-of-type {
    border-right: none;
  }

  .map-container-column {
    flex-grow: 1;
    border-bottom: var(--border);
  }

  .map-container-column:last-of-type {
    border-bottom: none;
  }

  /* ROW ORIENTATION */

  .maps-row {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100%;
    --border: 1px solid black;
  }

  .section-row {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    border-bottom: var(--border);
  }

  .section-row:last-of-type {
    border-bottom: none;
  }

  .map-container-row {
    flex-grow: 1;
    border-right: var(--border);
  }

  .map-container-row:last-of-type {
    border-right: none;
  }
</style>
