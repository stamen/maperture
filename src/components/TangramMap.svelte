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
    // Map.svelte blanks `url` to `undefined` while a poll tick is in
    // flight, to force GL renderers to pick up freshly re-fetched content
    // (see the note there). Tangram has no equivalent — `leafletLayer`
    // only ever consumes a URL, never a pre-fetched style object — so a
    // poll tick can never actually change what Tangram should show here.
    // Treating `undefined` as "no real change" avoids tearing down a
    // perfectly good, still-initializing scene to rebuild one with
    // `scene: undefined`, which crashes mid-init.
    if (currentUrl === undefined) return;
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
