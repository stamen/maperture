<script>
  import Dropdown from './inputs/Dropdown/Dropdown.svelte';

  let { rendererOptions, rendererValue, onSelectRenderer } = $props();
</script>

<div class="renderer-control">
  <span class="nowrap">Rendered with</span>
  <Dropdown
    options={rendererOptions.map(v => ({ label: v.name, value: v.value }))}
    activeValue={rendererValue}
    onSelect={onSelectRenderer}
    direction="up"
  />
</div>

<style>
  .renderer-control {
    align-items: center;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex-wrap: nowrap;
  }

  .nowrap {
    white-space: nowrap;
  }
</style>
