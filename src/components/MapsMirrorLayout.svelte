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

<div class={`mirror mirror-${rowOrColumn}-orientation`}>
  <div class="maps">
    {#each sections as maps}
      <div class="section">
        {#each maps as map}
          <div class="map-container">
            <Map {map} {...mapState} {numberOfMaps} on:mapMove />
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .mirror {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .maps {
    display: flex;
    height: calc(100% + 2px);
    width: calc(100% + 2px);
    margin-top: -1px;
    margin-left: -1px;
    --border: 1px solid black;
  }

  .mirror-column-orientation .maps {
    flex-direction: row;
  }

  .mirror-row-orientation .maps {
    flex-direction: column;
  }

  .section {
    display: flex;
    flex-grow: 1;
  }

  .mirror-column-orientation .section {
    flex-direction: column;
  }

  .mirror-row-orientation .section {
    flex-direction: row;
  }

  .map-container {
    flex-grow: 1;
    border: var(--border);
  }
</style>
