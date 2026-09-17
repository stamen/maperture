<script>
  import Map from './Map.svelte';

  let { maps, mapState, onMapMove } = $props();
</script>

<div class="viewer-container">
  <div class="maps phone">
    {#each maps as map (map.index)}
      <div class="map-container">
        <Map
          {map}
          {...mapState}
          labelStyle="position: absolute; margin-top: 48px; left: 0; right: 0; bottom: unset; max-width: unset;"
          numberOfMaps={maps.length}
          {onMapMove}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .viewer-container {
    display: flex;
    height: 100%;
    justify-content: space-around;
  }

  .maps {
    align-items: center;
    display: flex;
    flex-direction: row;
    align-self: center;
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
