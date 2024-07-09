<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Styles,
  } from 'sveltestrap';

  export let options;
  export let value;
  export let onClick;
  export let direction;
  export let placeholder;
</script>

<Styles />

<Dropdown theme="light" direction={direction ?? 'down'} autoClose={true}>
  <DropdownToggle caret color="light"
    >{options.find(o => o.value === value)?.label ??
      placeholder}</DropdownToggle
  >

  <DropdownMenu>
    {#each options as option}
      {#if option?.header}
        <DropdownItem header>{option?.header}</DropdownItem>
      {:else}
        <DropdownItem
          active={value === option.value}
          on:click={() => onClick(option.value)}>{option.label}</DropdownItem
        >
      {/if}
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
