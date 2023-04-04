<script>
  import Map from './Map.svelte';

  export let maps;
  export let mapState;

  const sliderWidth = 5;

  let dragging = false;
  let sliderPosition = 0;
  let width;
  let height;

  $: sliderPosition = width / 2;

  const handleSliderMouseDown = () => (dragging = true);
  const handleSliderMouseUp = () => (dragging = false);

  const handleSliderMouseMove = e => {
    if (!dragging || e.clientX === 0) return;
    sliderPosition = e.clientX - sliderWidth / 2;
  };

  $: rightWidth = width - sliderPosition;
  $: leftWidth = width - rightWidth;

  $: themeLeftMapLabel = `right: unset; margin-right:unset; left:0; margin-left:1em; max-width:calc(${leftWidth}px - 6em)`;
  $: themeRightMapLabel = `max-width:calc(${rightWidth}px - 6em)`;
</script>

<div
  class="maps"
  class:dragging
  on:mousemove={handleSliderMouseMove}
  on:mouseup={handleSliderMouseUp}
  bind:clientHeight={height}
  bind:clientWidth={width}
>
  {#each maps as map}
    <div
      class="map-container"
      style={map.index === 1 && sliderPosition
        ? `clip: rect(0px, ${width}px, ${height}px, ${sliderPosition}px)`
        : null}
    >
      <Map
        {map}
        {...mapState}
        numberOfMaps={maps.length}
        on:mapMove
        highlightDifferences={map.index === 1 && mapState?.showDiff}
        labelStyle={map.index === 0 ? themeLeftMapLabel : themeRightMapLabel}
      />
    </div>
  {/each}

  <div
    class="slider"
    style="left: {sliderPosition}px; width: {sliderWidth}px;"
    on:mousedown={handleSliderMouseDown}
  />
</div>

<style>
  .maps {
    height: 100%;
  }

  .maps.dragging .map-container {
    /* Avoid selecting text in maps / map label sections when dragging */
    user-select: none;
    -webkit-user-select: none;
  }

  .maps .map-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
