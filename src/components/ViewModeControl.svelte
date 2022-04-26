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
    if (mapsNum > 2) {
      if (selectedMode === 'swipe') selectedMode = 'mirror';
      viewModes = viewModes.filter(mode => mode !== 'swipe');
    }
    if (mapsNum > 4) {
      if (selectedMode === 'phone') selectedMode = 'mirror';
      viewModes = viewModes.filter(mode => mode !== 'phone');
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
