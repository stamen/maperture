<script>
  import Map from './Map.svelte';
  import { shortcut } from '../shortcut';

  let { maps, mapState, onMapMove, onMapSetDimensions } = $props();

  let height = $state(mapState.height || '100%');
  let width = $state(mapState.width || '100%');
  let heightInput = $state(mapState.height || '');
  let widthInput = $state(mapState.width || '');
  let heightInputFocused = $state(false);
  let widthInputFocused = $state(false);

  let map = $derived(maps[0]);
  let numberOfMaps = $derived(maps?.length ?? 0);

  // Remove width and height before passing down mapState as props to Map
  let mapStateProps = $derived.by(() => {
    const { width, height, ...props } = mapState;
    return props;
  });

  const setDimensions = () => {
    height = heightInput;
    width = widthInput;
    onMapSetDimensions({ options: { height, width } });
  };

  const onKeySubmit = () => {
    const inputFocused = heightInputFocused || widthInputFocused;
    const disabled = !widthInput || !heightInput;
    if (inputFocused && !disabled) {
      setDimensions();
    }
  };

  const resetDimensions = () => {
    height = '100%';
    width = '100%';
    heightInput = '';
    widthInput = '';
    onMapSetDimensions({ options: { height: null, width: null } });
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
        {onMapMove}
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
          onfocus={() => (heightInputFocused = true)}
          onblur={() => (heightInputFocused = false)}
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
          onfocus={() => (widthInputFocused = true)}
          onblur={() => (widthInputFocused = false)}
        />
      </div>
    </div>
    <div class="buttons">
      <button
        onclick={setDimensions}
        disabled={!widthInput || !heightInput}
        use:shortcut={{ code: 'Enter', callback: onKeySubmit }}
        >Set Dimensions</button
      >
      <button
        onclick={resetDimensions}
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
