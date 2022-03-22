<script>
  import { createEventDispatcher } from 'svelte';
  import Map from './Map.svelte';

  export let maps;
  export let mapState;
  export let viewMode;

  const dispatch = createEventDispatcher();
  const sliderWidth = 5;

  let dragging = false;
  let sliderPosition = 0;
  let width;
  let height;

  $: sliderPosition = width / 2;

  const handleSliderMouseDown = () => dragging = true;
  const handleSliderMouseUp = () => dragging = false;

  const handleSliderMouseMove = e => {
    if (!dragging || e.clientX === 0) return;
    sliderPosition = e.clientX - sliderWidth / 2;
  };

  const handleMapMove = event => {
    dispatch('mapState', { options: event.detail.options });
  };
</script>

<div class="maps {viewMode}"
  class:dragging
  on:mousemove={handleSliderMouseMove}
  on:mouseup={handleSliderMouseUp}
  bind:clientHeight={height}
  bind:clientWidth={width}
>

  <div class="maps-container">
    {#each maps as map }
      <div class="map-container" 
        style={viewMode === 'swipe' && map.index === 1 && sliderPosition ? `clip: rect(0px, ${width}px, ${height}px, ${sliderPosition}px)` : null}
      >
        <Map
          {...map}
          {...mapState}
          on:mapMove={handleMapMove}
          on:mapStyleState
        />
      </div>
    {/each}
  </div>

  {#if viewMode === 'swipe'}
    <div
      class="slider"
      style="left: {sliderPosition}px; width: {sliderWidth}px;"
      on:mousedown={handleSliderMouseDown}
    />
  {/if}
</div>

<style>
  .maps {
    display: flex;
    flex-grow: 1;
    position: relative;
  }

  .maps.dragging .maps-container {
    /* Avoid selecting text in maps / map label sections when dragging */
    user-select: none;
  }

  .maps.swipe .map-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .maps.phone .maps-container {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }

  .maps.phone .map-container {
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

  .slider {
    position: absolute;
    top: 0;
    bottom: 0;
    cursor: col-resize;
    background: black;
    z-index: 1000;
  }
</style>
