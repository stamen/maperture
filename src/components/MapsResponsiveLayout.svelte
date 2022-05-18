<script>
  import Map from './Map.svelte';

  export let maps;
  export let mapState;

  let numberOfMaps = 0;
  let map;
  let height = '100%';
  let width = '100%';
  let heightInput = '';
  let widthInput = '';

  $: {
    if (maps.length) {
      map = maps[0];
      // For now this should only ever be 1
      numberOfMaps = maps.length;
    }
  }

  const setDimensions = () => {
    height = heightInput;
    width = widthInput;
  };

  const resetDimensions = () => {
    height = '100%';
    width = '100%';
  };
</script>

<div class="maps responsive">
  <div class="map-container" style={`height:${height}px; width:${width}px`}>
    {#if map}
      <Map
        {map}
        {...mapState}
        {numberOfMaps}
        themeLabel="map-label-responsive"
        on:mapMove
      />
    {/if}
  </div>
  <div class="responsive-input">
    <div class="dimension-input">
      <span>Height:</span>
      <div class="input-container">
        <input type="number" class="input" bind:value={heightInput} />
      </div>
    </div>
    <div class="dimension-input">
      <span>Width:</span>
      <div class="input-container">
        <input type="number" class="input" bind:value={widthInput} />
      </div>
    </div>
    <div class="buttons">
      <button on:click={setDimensions}>Set Dimensions</button>
      <button on:click={resetDimensions}>Reset</button>
    </div>
  </div>
</div>

<style>
  .maps {
    display: flex;
    flex-grow: 1;
    height: 100%;
    width: 100%;
    justify-content: center;
  }

  .map-container {
    height: 100%;
    width: 100%;
    align-self: center;
    border: 1px solid black;
  }

  .responsive-input {
    position: absolute;
    left: 1em;
    bottom: 2em;
    background: white;
    box-shadow: 0 0 10px 2px rgb(0 0 0 / 10%);
    padding: 1em;
    display: flex;
    flex-direction: column;
    min-width: 120px;
    height: auto;
  }

  .dimension-input {
    display: flex;
    width: 100%;
    height: 36px;
    justify-content: space-between;
    align-items: center;
  }

  .input-container {
    display: flex;
    width: 66px;
    height: 30px;
  }

  .input {
    width: 100%;
    height: 100%;
  }

  .buttons {
    margin-top: 3px;
    display: flex;
    flex-direction: column;
  }

  /* Removes the arrow buttons from number inputs */
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
