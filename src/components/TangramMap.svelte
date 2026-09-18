<script>
  import { untrack } from 'svelte';
  import { leafletLayer } from 'tangram';
  import LeafletMap from './LeafletMap.svelte';

  let { mapStyle, ...restProps } = $props();

  let url = $derived(mapStyle.url);

  // Reuse the existing Tangram layer if it's already showing this scene;
  // only build a new one when `url` actually changes. Reads the current
  // layer via untrack() so this depends only on `url`, not on its own
  // output — the same class of bug fixed in Map.svelte's `stylesheet`.
  let overrideLayer = $state();
  $effect(() => {
    const currentUrl = url;
    const current = untrack(() => overrideLayer);
    if (current != null && current.options.scene === currentUrl) return;
    overrideLayer = leafletLayer({
      scene: currentUrl,
      webGLContextOptions: {
        preserveDrawingBuffer: true,
      },
    });
  });
</script>

<LeafletMap {mapStyle} {overrideLayer} {...restProps} />
