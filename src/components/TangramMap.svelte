<script>
  import { leafletLayer } from 'tangram';
  import LeafletMap from './LeafletMap.svelte';

  export let mapStyle;

  let overrideLayer;
  let url;

  $: ({ url } = mapStyle);

  $: overrideLayer = getLayer(url);

  const getLayer = url => {
    if (overrideLayer != null && overrideLayer.options.scene === url) {
      return overrideLayer;
    }

    return leafletLayer({
      scene: url,
      webGLContextOptions: {
        preserveDrawingBuffer: true,
      },
    });
  };
</script>

<LeafletMap {mapStyle} {overrideLayer} {...$$restProps} on:mapMove />
