<script>
  import DropdownToggle from './DropdownToggle.svelte';

  export let options;
  export let activeValue;
  export let onSelect;
  export let direction = 'up';
  export let placeholder = '';

  $: idOptions = options.map((o, i) => {
    let next = { ...o, id: `${i}` };
    if (next.options) {
      next.options = next.options.map((opt, iter) => ({
        ...opt,
        id: `${i}-${iter}`,
      }));
    }
    return next;
  });

  let topLevelOpen = false;
  let subLevelOpen = null;

  const openTopLevel = () => {
    // Flip the switch
    topLevelOpen = !topLevelOpen;
    // If closing
    if (!topLevelOpen) {
      subLevelOpen = null;
    } else {
      const presetOptions = idOptions.filter(o => o.options);
      const activeOption = presetOptions.find(o =>
        o.options.some(v => v.value === activeValue)
      );
      if (activeOption) {
        subLevelOpen = activeOption.id;
      }
    }
  };

  const openSubLevel = id => {
    subLevelOpen = subLevelOpen === id ? null : id;
  };

  const fakeFn = () => false;

  $: activeLabel = idOptions
    .filter(v => !v?.header)
    .map(v => (v?.options ? v?.options : v))
    .flat()
    .find(v => v.value === activeValue)?.label;

  const onClick = v => {
    onSelect(v);
    topLevelOpen = false;
    subLevelOpen = null;
  };
</script>

<div class="dropdown">
  {#if direction === 'down'}
    <DropdownToggle
      {openTopLevel}
      {topLevelOpen}
      {activeLabel}
      {direction}
      {placeholder}
    />
  {/if}

  {#if topLevelOpen}
    <div class={`menu ${direction === 'up' ? 'menu-top' : 'menu-bottom'}`}>
      {#each idOptions as option}
        {#if option?.header}
          <div class="header">
            <div class="label-container">
              <div class="label">
                {option?.header}
              </div>
            </div>
          </div>
          <!-- If suboptions are present -->
        {:else if option?.options}
          <div class="dropdown">
            <div
              class={`menu-item ${activeValue === option.value && 'active'}`}
              title={option.label}
              on:click={() => openSubLevel(option.id)}
              on:keydown={fakeFn}
            >
              <div class="caret-container">
                <div
                  class={subLevelOpen === option.id
                    ? 'caret-down'
                    : 'caret-right'}
                />
              </div>
              <div class="label-container">
                <div class="label">
                  {option.label}
                </div>
              </div>
            </div>

            {#if subLevelOpen === option.id}
              <div class="submenu">
                {#each option?.options as suboption}
                  <div
                    class={`menu-item ${
                      activeValue === suboption.value && 'active'
                    }`}
                    title={suboption.label}
                    on:click={() => onClick(suboption.value)}
                    on:keydown={fakeFn}
                  >
                    <div class="label-container">
                      <div class="label">
                        {suboption.label}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {:else}
          <!-- Normal option -->
          <div
            class={`menu-item ${activeValue === option.value && 'active'}`}
            title={option.label}
            on:click={() => onClick(option.value)}
            on:keydown={fakeFn}
          >
            <div class="caret-container" />
            <div class="label-container">
              <div class="label">
                {option.label}
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}

  {#if direction === 'up'}
    <DropdownToggle
      {openTopLevel}
      {topLevelOpen}
      {activeLabel}
      {direction}
      {placeholder}
    />
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
    width: 100%;
  }

  .header {
    height: 32px;
    padding: 6px;
    display: flex;
    align-items: center;
    color: darkgray;
    font-weight: bold;
  }

  .menu {
    position: absolute;
    background-color: white;
    max-height: 300px;
    overflow-y: auto;
    /* Account for borders */
    width: calc(100% - 2px);
    border-left: 1px solid lightgray;
    border-right: 1px solid lightgray;
    z-index: 1;
  }

  .menu-top {
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    border-top: 1px solid lightgray;
    /* Account for borders */
    bottom: calc(32px + 2px);
  }

  .menu-bottom {
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    border-bottom: 1px solid lightgray;
    /* Account for borders */
    top: calc(32px + 2px);
  }

  .submenu {
    background-color: #f9f9f9;
  }

  .submenu .menu-item {
    padding-left: 2rem;
  }

  .submenu .menu-item:hover {
    padding-left: 2rem;
  }

  .menu-item {
    height: 32px;
    padding-left: 6px;
    padding-right: 6px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .menu-item:hover {
    height: 32px;
    padding-left: 6px;
    padding-right: 6px;
    background-color: lightgray;
  }

  .active {
    background-color: blue;
    color: white;
  }

  .active:hover {
    background-color: blue;
    color: white;
  }

  .label-container {
    flex-grow: 1;
    width: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .label {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .caret-container {
    height: 1rem;
    width: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .caret-right {
    border-left: solid 5px black;
    border-top: solid 5px transparent;
    border-bottom: solid 5px transparent;
    height: 0;
    width: 0;
  }

  .caret-down {
    border-left: solid 5px transparent;
    border-right: solid 5px transparent;
    border-top: solid 5px black;
    height: 0;
    width: 0;
  }

  .caret-up {
    border-left: solid 5px transparent;
    border-right: solid 5px transparent;
    border-bottom: solid 5px black;
    height: 0;
    width: 0;
  }
</style>
