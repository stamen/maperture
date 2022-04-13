<script>
  import Map from './Map.svelte';

  export let maps;
  export let mapState;
</script>

<div class="maps phone">
  {#each maps as map}
    <div class="map-container">
      <Map index={map.index} {...mapState} on:mapMove />
    </div>
  {/each}
</div>

<style>
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
