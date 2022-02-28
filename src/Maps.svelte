<script>
  import { createEventDispatcher } from 'svelte';
  import Map from './Map.svelte';

  export let maps;
  export let mapStateUpdateOrigin;

  let width;
  let sliderPosition = 0;
  const sliderWidth = 10;

  $: sliderPosition = width / 2;

  let dragging = false;

  const handleSliderMouseDown = e => {
    dragging = true;
  };

  const handleSliderMouseMove = e => {
    if (!dragging || e.clientX === 0) return;
    sliderPosition = e.clientX - sliderWidth / 2;
  };

  const handleSliderMouseUp = e => {
    dragging = false;
  };

  const dispatch = createEventDispatcher();

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
	sliderPosition={map.index > 0 ? sliderPosition : null}
	mapStateUpdateOrigin={mapStateUpdateOrigin}
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
    cursor: pointer;
    background: black;
    z-index: 1000;
  }
</style>
