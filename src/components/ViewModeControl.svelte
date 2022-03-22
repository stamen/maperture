<script>
  import { createEventDispatcher } from 'svelte';
  export let mode;

  const dispatch = createEventDispatcher();
  const modes = ['swipe', 'phone'];
  let selectedMode = '';

  $: selectedMode = mode;

  $: if (selectedMode) {
    handleChange();
  }

  const handleChange = () => {
    dispatch('viewMode', { mode: selectedMode });
  }
</script>

<div>
  <select bind:value={selectedMode}>
    {#each modes as mode}
      <option>{mode}</option>
    {/each}
  </select>
</div>
