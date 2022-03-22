<script>
  import Map from './Map.svelte';

  export let maps;
  export let mapState;
</script>

<div class="maps phone">
  <div class="maps-container">
    {#each maps as map }
      <div class="map-container">
        <Map
          {...map}
          {...mapState}
          on:mapMove
          on:mapStyleState
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .maps {
    display: flex;
    flex-grow: 1;
    height: 100%;
    position: relative;
  }

  .maps .maps-container {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
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
    border-radius: 30px;
  }
</style>
