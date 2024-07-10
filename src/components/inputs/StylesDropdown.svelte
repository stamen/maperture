<script>
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

  $: isActiveOption = dropdownId => {
    let active = dropdownValue.dropdownId === dropdownId;
    return active;
  };

  $: isActiveParentToggle = presets => {
    let active = presets.some(p => isActiveOption(p.dropdownId));
    return active;
  };

  let isOpen = false;

  $: onClick = v => {
    onSelect(v);
  };
</script>

<Styles />

<Dropdown theme="light" direction="up" autoClose={true}>
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

<style>
  :global(.dropdown-toggle) {
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    border: 1px solid lightgray !important;
    white-space: nowrap !important;
  }

  :global(.dropdown-item) {
    border: none !important;
  }

  :global(.dropdown-menu) {
    width: 100%;
  }
</style>
