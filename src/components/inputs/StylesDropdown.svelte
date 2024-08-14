<script>
  import { onMount } from 'svelte';
  import Dropdown from './Dropdown/Dropdown.svelte';

  export let dropdownDisplayOptions;
  export let dropdownValue;
  export let onSelect;
  export let index;

  let direction = 'up';

  onMount(() => {
    const screenHeight = document?.body?.clientHeight;
    const element = document?.getElementById(`styles-dropdown-${index}`);
    const position = element?.getBoundingClientRect();
    const y = position?.top;
    if (!y || !screenHeight) return;
    direction = y < screenHeight / 2 ? 'down' : 'up';
  });

  $: formattedOptions = Object.entries(dropdownDisplayOptions).reduce(
    (acc, [k, v]) => {
      acc.push({ header: k });
      for (const option of v) {
        if (option.type === 'sublist') {
          acc.push({
            label: option.text,
            options: option.presets.map(o => ({
              label: o.text,
              value: o.dropdownId,
            })),
          });
        } else {
          acc.push({ label: option.text, value: option.dropdownId });
        }
      }
      return acc;
    },
    []
  );
</script>

<div id={`styles-dropdown-${index}`}>
  <Dropdown
    options={formattedOptions}
    activeValue={dropdownValue.dropdownId}
    {onSelect}
    {direction}
  />
</div>

<style>
</style>
