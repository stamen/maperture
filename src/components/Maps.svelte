<script>
  import { createEventDispatcher } from 'svelte';
  import Map from './Map.svelte';

  export let maps;
  export let mapState;

  const dispatch = createEventDispatcher();
  const sliderWidth = 5;

  let dragging = false;
  let sliderPosition = 0;
  let width;

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

<div class="maps"
  class:dragging
  on:mousemove={handleSliderMouseMove}
  on:mouseup={handleSliderMouseUp}
  bind:clientWidth={width}
>

  <div class="maps-container">
    {#each maps as map }
      <Map
        {...map}
        {...mapState}
        sliderPosition={map.index > 0 ? sliderPosition : null}
        on:mapMove={handleMapMove}
      />
    {/each}
  </div>

  <div
    class="slider"
    style="left: {sliderPosition}px; width: {sliderWidth}px;"
    on:mousedown={handleSliderMouseDown}
  />
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

  .slider {
    position: absolute;
    top: 0;
    bottom: 0;
    cursor: col-resize;
    background: black;
    z-index: 1000;
  }
</style>
