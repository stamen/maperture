<script>
  import { fetchUrl } from '../fetch-url';
  import StylesDropdown from './inputs/StylesDropdown.svelte';
  import StyleUrlInput from './StyleUrlInput.svelte';
  import RendererPicker from './RendererPicker.svelte';

  let {
    groups,
    selectedOption,
    rendererOptions,
    rendererValue,
    index,
    onSelectOption,
    onSelectRenderer,
    onApply,
  } = $props();

  let presetError = $state(null);

  // Presets other than google/leaflet reference a style JSON that needs
  // fetching; google/leaflet presets apply directly. Only fires when a
  // *different* option is picked (`lastAppliedKey` is a plain closure
  // variable, not $state, so reading it here creates no dependency — this
  // effect only reacts to `selectedOption` changing).
  let lastAppliedKey = selectedOption.key;
  $effect(() => {
    if (selectedOption.key === lastAppliedKey) return;
    lastAppliedKey = selectedOption.key;
    presetError = null;

    if (selectedOption.kind !== 'preset') return;
    if (['google', 'leaflet'].includes(selectedOption.type)) {
      onApply({ ...selectedOption });
      return;
    }
    fetchUrl(selectedOption.url)
      .then(style => onApply({ ...selectedOption, style }))
      .catch(err => {
        presetError = new Error(err.message);
      });
  });
</script>

<div class="map-style-input">
  <StylesDropdown
    {groups}
    activeKey={selectedOption.key}
    {index}
    onSelect={onSelectOption}
  />

  {#if selectedOption.kind === 'branch' || selectedOption.kind === 'custom'}
    <StyleUrlInput option={selectedOption} {onApply} />
  {/if}

  {#if presetError}
    <div class="error-message">{presetError}</div>
  {/if}

  <RendererPicker {rendererOptions} {rendererValue} {onSelectRenderer} />
</div>

<style>
  .map-style-input {
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    max-width: 300px;
  }

  .error-message {
    background-color: lightcoral;
    border-style: solid;
    border-color: red;
    border-width: 1px;
    border-radius: 4px;
    padding: 6px;
    color: white;
  }
</style>
