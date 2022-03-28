<script>
  import { createEventDispatcher } from "svelte";
  import { VIEW_MODES } from "../constants";

  export let mode;

  const dispatch = createEventDispatcher();
  let selectedMode = "";

  $: selectedMode = mode;

  $: if (selectedMode) {
    handleChange();
  }

  const handleChange = () => {
    dispatch("viewMode", { mode: selectedMode });
  };
</script>

<div>
  <select bind:value={selectedMode}>
    {#each VIEW_MODES as mode}
      <option>{mode}</option>
    {/each}
  </select>
</div>
