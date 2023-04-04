<script>
  import { createEventDispatcher } from 'svelte';
  import Map from './Map.svelte';
  import { shortcut } from '../shortcut';

  export let maps;
  export let mapState;

  const dispatch = createEventDispatcher();

  let height = mapState.height || '100%';
  let width = mapState.width || '100%';
  let heightInput = mapState.height || '';
  let widthInput = mapState.width || '';
  let heightInputFocused = false;
  let widthInputFocused = false;

  let mapStateProps = mapState;
  delete mapStateProps.width;
  delete mapStateProps.height;

  $: map = maps[0];
  $: numberOfMaps = maps?.length ?? 0;

  $: {
    // Remove width and height before passing down mapState as props to Map
    let { width, height, ...props } = mapState;
    mapStateProps = props;
  }

  const onKeySubmit = () => {
    const inputFocused = heightInputFocused || widthInputFocused;
    const disabled = !widthInput || !heightInput;
    if (inputFocused && !disabled) {
      setDimensions();
    }
  };

  const setDimensions = () => {
    height = heightInput;
    width = widthInput;
    dispatch('mapSetDimensions', { options: { height, width } });
  };

  const resetDimensions = () => {
    height = '100%';
    width = '100%';
    heightInput = '';
    widthInput = '';
    dispatch('mapSetDimensions', { options: { height: null, width: null } });
  };
</script>

<div class="maps responsive">
  <div class="map-container" style={`height:${height}px; width:${width}px`}>
    {#if map}
      <Map
        {map}
        {...mapStateProps}
        {numberOfMaps}
        labelStyle="position: fixed;"
        on:mapMove
      />
    {/if}
  </div>
  <div class="responsive-input">
    <div class="dimension-input">
      <span>Height:</span>
      <div class="input-container">
        <input
          type="number"
          class="input"
          bind:value={heightInput}
          on:focus={() => (heightInputFocused = true)}
          on:blur={() => (heightInputFocused = false)}
        />
      </div>
    </div>
    <div class="dimension-input">
      <span>Width:</span>
      <div class="input-container">
        <input
          type="number"
          class="input"
          bind:value={widthInput}
          on:focus={() => (widthInputFocused = true)}
          on:blur={() => (widthInputFocused = false)}
        />
      </div>
    </div>
    <div class="buttons">
      <button
        on:click={setDimensions}
        disabled={!widthInput || !heightInput}
        use:shortcut={{ code: 'Enter', callback: onKeySubmit }}
        >Set Dimensions</button
      >
      <button
        on:click={resetDimensions}
        disabled={height === '100%' && width === '100%'}>Reset</button
      >
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
