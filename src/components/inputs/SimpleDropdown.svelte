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
  /* :global(.dropdown) {
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

  :global(.dropdown-toggle::before) {
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

  :global(.dropdown-toggle::after) {
    display: none !important;
    margin-left: unset;
    vertical-align: unset;
    content: unset;
    border-top: unset;
    border-right: unset;
    border-bottom: unset;
    border-left: unset;
  } */

  :global(.dropdown-item) {
    border: none !important;
  }

  :global(.dropdown-menu) {
    width: 100%;
  }
</style>
