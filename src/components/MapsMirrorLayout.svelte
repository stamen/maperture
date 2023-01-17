<script>
  import Map from './Map.svelte';

  export let maps = [];
  export let mapState;

  let sections = [];
  let numberOfMaps = 0;
  // When we have this many maps, the layout works
  // better as rows versus columns
  const rowExceptions = [2, 6];
  let rowOrColumn;

  $: numberOfMaps = maps.length;

  $: rowOrColumn = rowExceptions.includes(numberOfMaps) ? 'row' : 'column';

  const getSections = maps => {
    const numOfSections = Math.round(Math.sqrt(numberOfMaps));
    const mapsPerSection = Math.floor(numberOfMaps / numOfSections);
    let mapArr = JSON.parse(JSON.stringify(maps));
    let nextSections = [];
    while (mapArr.length) {
      nextSections.push(mapArr.slice(0, mapsPerSection));
      mapArr = mapArr.slice(mapsPerSection);
    }
    sections = nextSections;
  };

  $: getSections(maps);
</script>

<div class={`mirror mirror-${rowOrColumn}-orientation`}>
  <div class="maps">
    {#each sections as maps}
      <div class="section">
        {#each maps as map}
          <div class="map-container map-container-border">
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
    /* To account for not showing a border at the edges of the screen */
    height: calc(100% + 2px);
    width: calc(100% + 2px);
    margin-top: -1px;
    margin-left: -1px;
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
  }

  .map-container-border {
    border: 1px solid #666;
  }

  .map-container-border-transparent {
    border: 1px solid transparent;
  }
</style>
