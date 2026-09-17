<script>
  import { linkLocations as linkLocationsStore } from '../stores';
  import { VIEW_MODES } from '../constants';
  import Dropdown from './inputs/Dropdown/Dropdown.svelte';

  let { mode, mapsNum, onViewMode } = $props();

  // Pure computation from mapsNum/linkLocations — no writes, so nothing here
  // can read and write the same state (the cause of the infinite-update loop
  // this replaced: see https://svelte.dev/e/effect_update_depth_exceeded).
  let viewModes = $derived.by(() => {
    let next = VIEW_MODES;

    if (mapsNum === 1) {
      next = VIEW_MODES.filter(mode => mode !== 'swipe');
    } else if (mapsNum === 2) {
      next = VIEW_MODES.filter(mode => mode !== 'responsive');
    } else if (mapsNum > 2 && mapsNum <= 4) {
      next = VIEW_MODES.filter(
        mode => mode !== 'swipe' && mode !== 'responsive'
      );
    } else if (mapsNum > 4) {
      next = VIEW_MODES.filter(
        mode => mode !== 'swipe' && mode !== 'phone' && mode !== 'responsive'
      );
    }

    if (!$linkLocationsStore) {
      next = ['mirror'];
    }

    return next;
  });

  // The mode we should actually be in: the incoming prop if it's still a
  // valid choice, otherwise the first allowed one.
  let effectiveMode = $derived(
    viewModes.includes(mode) ? mode : viewModes[0]
  );

  // Tell the parent whenever the effective mode disagrees with what it
  // thinks we're in — covers both mapsNum/linking auto-correction and (via
  // onSelect below) a direct user pick, once the parent's `mode` prop
  // catches up this becomes a no-op and settles.
  $effect(() => {
    if (effectiveMode !== mode) {
      onViewMode({ mode: effectiveMode });
    }
  });

  const onSelect = v => {
    onViewMode({ mode: v });
  };
</script>

<div class="dropdown-container">
  <Dropdown
    options={viewModes.map(v => ({ label: v, value: v }))}
    activeValue={effectiveMode}
    {onSelect}
    direction="down"
  />
</div>

<style>
  .dropdown-container {
    min-width: 100px;
  }
</style>
