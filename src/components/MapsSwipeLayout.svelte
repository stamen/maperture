<script>
  import Map from './Map.svelte';

  let { maps, mapState, onMapMove } = $props();

  const sliderWidth = 5;

  let dragging = $state(false);
  let sliderPosition = $state(0);
  let width = $state(0);
  let height = $state(0);

  $effect(() => {
    sliderPosition = width / 2;
  });

  const handleSliderMouseDown = () => (dragging = true);
  const handleSliderMouseUp = () => (dragging = false);

  const handleSliderMouseMove = e => {
    if (!dragging || e.clientX === 0) return;
    sliderPosition = e.clientX - sliderWidth / 2;
  };

  let rightWidth = $derived(width - sliderPosition);
  let leftWidth = $derived(width - rightWidth);

  let themeLeftMapLabel = $derived(
    `right: unset; margin-right:unset; left:0; margin-left:1em; max-width:calc(${leftWidth}px - 6em)`,
  );
  let themeRightMapLabel = $derived(`max-width:calc(${rightWidth}px - 6em)`);
</script>

<div
  class="maps"
  class:dragging
  onmousemove={handleSliderMouseMove}
  onmouseup={handleSliderMouseUp}
  bind:clientHeight={height}
  bind:clientWidth={width}
>
  {#each maps as map (map.index)}
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
        {onMapMove}
        highlightDifferences={map.index === 1 && mapState?.showDiff}
        labelStyle={map.index === 0 ? themeLeftMapLabel : themeRightMapLabel}
      />
    </div>
  {/each}

  <div
    class="slider"
    style="left: {sliderPosition}px; width: {sliderWidth}px;"
    onmousedown={handleSliderMouseDown}
  ></div>
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
