<script>
  import { createEventDispatcher } from 'svelte';
  import { linkLocations as linkLocationsStore } from '../stores';
  import { VIEW_MODES } from '../constants';
  import Dropdown from './inputs/Dropdown/Dropdown.svelte';

  export let mode;
  export let mapsNum;

  const dispatch = createEventDispatcher();
  let selectedMode = mode ?? '';
  let viewModes = VIEW_MODES;

  const updateViewModeFromMapCount = mapCount => {
    if (mapCount === 1) {
      viewModes = VIEW_MODES.filter(mode => mode !== 'swipe');
    }
    if (mapCount === 2) {
      viewModes = VIEW_MODES.filter(mode => mode !== 'responsive');
    }
    if (mapCount > 2 && mapCount <= 4) {
      viewModes = VIEW_MODES.filter(
        mode => mode !== 'swipe' && mode !== 'responsive'
      );
    }
    if (mapCount > 4) {
      viewModes = VIEW_MODES.filter(
        mode => mode !== 'swipe' && mode !== 'phone' && mode !== 'responsive'
      );
    }

    if (!$linkLocationsStore) {
      viewModes = ['mirror'];
    }

    if (!viewModes.includes(selectedMode)) {
      selectedMode = viewModes[0];
    }
  };

  const handleChange = mode => {
    dispatch('viewMode', { mode });
  };

  const updateSelectedModeFromProps = nextMode => {
    // Normally selectedMode should change mode, but via props it's reversed
    // So that the bound selectedMode displays correctly
    if (nextMode !== selectedMode) {
      selectedMode = nextMode;
    }
  };

  $: updateViewModeFromMapCount(mapsNum);

  $: handleChange(selectedMode);

  // Run on any change to linking locations
  linkLocationsStore.subscribe(() => {
    updateViewModeFromMapCount(mapsNum);
  });

  // Trigger only on incoming mode prop
  $: updateSelectedModeFromProps(mode);

  $: onSelect = v => {
    selectedMode = v;
  };
</script>

<div class="dropdown-container">
  <Dropdown
    options={viewModes.map(v => ({ label: v, value: v }))}
    activeValue={selectedMode}
    {onSelect}
    direction="down"
  />
</div>

<style>
  .dropdown-container {
    min-width: 100px;
  }
</style>
