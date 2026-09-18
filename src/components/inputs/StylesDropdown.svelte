<script>
  import { onMount } from 'svelte';
  import Dropdown from './Dropdown/Dropdown.svelte';

  let { groups, activeKey, onSelect, index } = $props();

  let direction = $state('up');

  onMount(() => {
    const screenHeight = document?.body?.clientHeight;
    const element = document?.getElementById(`styles-dropdown-${index}`);
    const position = element?.getBoundingClientRect();
    const y = position?.top;
    if (!y || !screenHeight) return;
    direction = y < screenHeight / 2 ? 'down' : 'up';
  });

  let formattedOptions = $derived(
    groups.flatMap(group => [
      { header: group.header },
      ...group.items.map(item =>
        item.sublist
          ? {
              label: item.label,
              options: item.sublist.map(o => ({
                label: o.label,
                value: o.key,
              })),
            }
          : { label: item.label, value: item.key },
      ),
    ]),
  );
</script>

<div id={`styles-dropdown-${index}`}>
  <Dropdown
    options={formattedOptions}
    activeValue={activeKey}
    {onSelect}
    {direction}
  />
</div>
