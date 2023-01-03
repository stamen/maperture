<script>
  import { leafletLayer } from 'tangram';
  import LeafletMap from './LeafletMap.svelte';

  export let index;
  export let id;
  export let center;
  export let zoom;
  export let mapStyle;
  export let numberOfMaps;

  let overrideLayer;
  let url;

  $: ({ url } = mapStyle);

  $: overrideLayer = getLayer(url);

  const getLayer = url => {
    if (overrideLayer != null && overrideLayer.options.scene === url) {
      return;
    }

    // TODO this doesn't quite work!
    return leafletLayer({
      scene: url,
      webGLContextOptions: {
        preserveDrawingBuffer: true,
      },
    });
  };
</script>

<LeafletMap {index} {id} {center} {mapStyle} {numberOfMaps} {overrideLayer} />
