<script>
  import Map from './Map.svelte';

  export let maps;
  export let mapState;
</script>

<div class="viewer-container">
  <div class="maps phone">
    {#each maps as map}
      <div class="map-container">
        <Map
          {map}
          {...mapState}
          themeLabel="map-label-offset"
          numberOfMaps={maps.length}
          on:mapMove
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .viewer-container {
    display: flex;
    height: 100%;
  }

  .maps {
    align-items: center;
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    justify-content: space-around;
  }

  .maps .map-container {
    border: 20px solid #333;
    border-radius: 30px;
    box-shadow: 0 0 10px 2px rgb(0 0 0 / 10%);
    height: 620px;
    margin: 20px;
    width: 300px;
  }

  :global(.maps.phone .mapboxgl-map) {
    border-radius: 10px;
  }
</style>
