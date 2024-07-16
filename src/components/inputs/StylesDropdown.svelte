<script>
  import { onMount } from 'svelte';
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Styles,
  } from 'sveltestrap';

  export let dropdownDisplayOptions;
  export let dropdownValue;
  export let onSelect;
  export let index;

  let direction = 'up';

  $: isActiveOption = dropdownId => {
    let active = dropdownValue.dropdownId === dropdownId;
    return active;
  };

  $: isActiveParentToggle = presets => {
    let active = presets.some(p => isActiveOption(p.dropdownId));
    return active;
  };

  $: onClick = v => {
    onSelect(v);
  };

  onMount(() => {
    const screenHeight = document?.body?.clientHeight;
    const element = document?.getElementById(`styles-dropdown-${index}`);
    const position = element?.getBoundingClientRect();
    const y = position?.top;
    if (!y || !screenHeight) return;
    direction = y < screenHeight / 2 ? 'down' : 'up';
  });
</script>

<Styles />

<div id={`styles-dropdown-${index}`}>
  <Dropdown theme="light" {direction} autoClose={true}>
    <DropdownToggle caret color="light"
      >{dropdownValue?.name ?? dropdownValue?.id}</DropdownToggle
    >

    <DropdownMenu>
      {#each Object.keys(dropdownDisplayOptions) as group}
        <DropdownItem header>{group}</DropdownItem>

        {#each dropdownDisplayOptions[group] as value}
          {#if value?.type === 'sublist'}
            <Dropdown direction="right" autoClose={true}>
              <DropdownToggle
                caret
                class="dropdown-item"
                active={isActiveParentToggle(value.presets)}
                color="light">{value.text}</DropdownToggle
              >
              <DropdownMenu>
                {#each value.presets as subPreset}
                  <DropdownItem
                    active={isActiveOption(subPreset.dropdownId)}
                    on:click={() => onClick(subPreset.dropdownId)}
                    >{subPreset.text}</DropdownItem
                  >
                {/each}
              </DropdownMenu>
            </Dropdown>
          {:else}
            <DropdownItem
              active={isActiveOption(value.dropdownId)}
              on:click={() => onClick(value.dropdownId)}
              >{value.text}</DropdownItem
            >
          {/if}
        {/each}
      {/each}
    </DropdownMenu>
  </Dropdown>
</div>

<style>
  :global(.dropdown) {
    display: flex !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }

  :global(.dropdown-toggle) {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    border: 1px solid lightgray !important;
    white-space: nowrap !important;
    flex: 1 !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }

  :global(.dropdown-item) {
    border: none !important;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  :global(.dropdown-menu) {
    width: 100%;
  }
</style>
