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
    max-width: 240px !important;
    min-width: 100px !important;
  }

  :global(.dropdown-toggle) {
    width: 100% !important;
    border: 1px solid lightgray !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* down */
  :global(.dropdown .dropdown-toggle::before) {
    display: inline-block;
    margin-left: 0.5em;
    vertical-align: 0.255em;
    content: '';
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
    float: right;
    margin-top: 9px;
  }

  /* up */
  :global(.dropup .dropdown-toggle::before) {
    display: inline-block;
    margin-left: 0.5em;
    vertical-align: 0.255em;
    content: '';
    border-top: 0;
    border-right: 0.3em solid transparent;
    border-bottom: 0.3em solid;
    border-left: 0.3em solid transparent;
    float: right;
    margin-top: 9px;
  }

  /* right */
  :global(.dropend .dropdown-toggle::before) {
    display: inline-block;
    margin-left: 0.5em;
    vertical-align: 0.255em;
    content: '';
    border-right: 0;
    border-top: 0.3em solid transparent;
    border-left: 0.3em solid;
    border-bottom: 0.3em solid transparent;
    float: right;
    margin-top: 9px;
  }

  :global(.dropdown-toggle::after) {
    display: none !important;
    margin-left: unset;
    vertical-align: unset;
    content: unset;
    border-top: unset;
    border-right: unset;
    border-bottom: unset;
    border-left: unset;
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
