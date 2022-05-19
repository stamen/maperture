<script>
  import { createEventDispatcher } from 'svelte';
  import { VIEW_MODES } from '../constants';

  export let mode;
  export let mapsNum;

  const dispatch = createEventDispatcher();
  let selectedMode = '';
  let viewModes = VIEW_MODES;

  $: selectedMode = mode;

  $: if (selectedMode) {
    handleChange();
  }

  $: {
    if (mapsNum === 1) {
      viewModes = VIEW_MODES.filter(mode => mode !== 'swipe');
    }
    if (mapsNum === 2) {
      viewModes = VIEW_MODES.filter(mode => mode !== 'responsive');
    }
    if (mapsNum > 2 && mapsNum <= 4) {
      viewModes = VIEW_MODES.filter(
        mode => mode !== 'swipe' && mode !== 'responsive'
      );
    }
    if (mapsNum > 4) {
      viewModes = VIEW_MODES.filter(
        mode => mode !== 'swipe' && mode !== 'phone' && mode !== 'responsive'
      );
    }

    if (!viewModes.includes(selectedMode)) {
      selectedMode = viewModes[0];
    }
  }

  const handleChange = () => {
    dispatch('viewMode', { mode: selectedMode });
  };
</script>

<div>
  <select bind:value={selectedMode}>
    {#each viewModes as mode}
      <option>{mode}</option>
    {/each}
  </select>
</div>
