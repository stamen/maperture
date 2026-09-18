<script>
  import { onMount, untrack } from 'svelte';
  import {
    maps as mapsStore,
    stylePresets as stylePresetsStore,
    config as configStore,
  } from '../stores';
  import {
    buildStyleOptions,
    resolveKeyForMap,
    withDefaultText,
  } from '../style-options';
  import { getRenderers } from '../renderers';
  import { poll as pollStyleUrl } from '../style-polling';
  import { fetchUrl } from '../fetch-url';
  import MapStyleInput from './MapStyleInput.svelte';

  let { index, stylesheet } = $props();

  let map = $derived($mapsStore.find(m => m.index === index));

  // Poll whatever's currently applied to this map, regardless of whether it
  // got there via a preset, a branch style, or a custom URL — see
  // style-polling.js for why this is triggered imperatively (from onApply
  // and once on mount) rather than from a $effect watching map.url.
  const startPolling = url => {
    pollStyleUrl(url, {
      isStillActive: candidateUrl => map?.url === candidateUrl,
      fetchStyle: fetchUrl,
      onChange: style => onApply({ style, isPolling: true }),
      onError: err => console.error('Failed to poll style from URL:', err),
    });
  };

  onMount(() => {
    if (map?.url) startPolling(map.url);
  });

  let { groups, options } = $derived(
    buildStyleOptions({
      stylePresets: $stylePresetsStore,
      branchPatterns: $configStore.branchPatterns,
    }),
  );

  let selectedKey = $state(map ? resolveKeyForMap({ options, map }) : 'custom');

  // Reconciles the local selection with the map's actual applied style when
  // it changes for some reason other than picking a new one here (e.g. the
  // whole maps array getting rebuilt when a different map is added or
  // removed). Deliberately never resets a branch/custom pick the user
  // hasn't submitted yet — those options don't have a `url` until applied,
  // so an unrelated map-array rebuild would otherwise look like a mismatch
  // and yank the input out from under whatever they're typing. Uses
  // untrack() so this depends only on `map`, never on its own output — the
  // same class of bug fixed in Map.svelte's `stylesheet` effect.
  $effect(() => {
    const currentMap = map;
    if (!currentMap) return;
    const current = untrack(() => options.get(selectedKey));
    if (!current || current.kind !== 'preset') return;
    if (currentMap.type !== current.type || currentMap.url !== current.url) {
      selectedKey = resolveKeyForMap({ options, map: currentMap });
    }
  });

  let selectedOption = $derived(
    withDefaultText({ option: options.get(selectedKey), map }),
  );

  let rendererOptions = $derived(
    getRenderers(selectedOption, stylesheet?.sources),
  );

  // Purely derived from the map's own persisted renderer/type, and written
  // straight back to the store on selection — no local copy to keep in
  // sync, so there's nothing here that can drift or loop.
  let rendererValue = $derived.by(() => {
    const valid = rendererOptions.map(r => r.value);
    if (map?.renderer && valid.includes(map.renderer)) return map.renderer;
    return valid.includes(selectedOption.type) ? selectedOption.type : valid[0];
  });

  const onSelectOption = key => {
    selectedKey = key;
  };

  const onSelectRenderer = renderer => {
    mapsStore.update(current =>
      current.map((m, i) => (i === index ? { ...m, renderer } : m)),
    );
  };

  const onApply = value => {
    if (value.isPolling) {
      mapsStore.update(current =>
        current.map((m, i) => (i === index ? { ...m, ...value } : m)),
      );
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const { key, kind, defaultText, ...rest } = value;
    const nextMap = {
      ...rest,
      index,
      renderer: map.renderer,
      id: value.id ?? value.style?.id,
      name: value.name ?? value.style?.name,
    };

    mapsStore.update(current =>
      current.map((m, i) => (i === index ? nextMap : m)),
    );
    startPolling(nextMap.url);
  };
</script>

<div class="map-style-input-wrapper">
  {#if map}
    <MapStyleInput
      {groups}
      {selectedOption}
      {rendererOptions}
      {rendererValue}
      {index}
      {onSelectOption}
      {onSelectRenderer}
      {onApply}
    />
  {/if}
</div>

<style>
  .map-style-input-wrapper {
    margin-top: 6px;
  }
</style>
