<script>
  import { config as configStore, mapObj as mapObjStore } from '../stores';

  export let mapId;
  export let mapIdIndex;

  const { customJs } = $configStore;

  $: validActions = customJs.filter(js => js.mapIds.includes(mapId));

  $: dropdownOptions = validActions.filter(ui => ui.type === 'dropdown');

  let selectedDropdown = null;

  $: {
    if (!dropdownOptions.length) {
      selectedDropdown = null;
    }
  }

  const onClickDropdown = e => {
    const { dropdown, option } = JSON.parse(e.target.value);
    const opt = dropdownOptions?.[dropdown]?.options?.[option];
    const index = mapIdIndex.split('-').pop();
    const map = $mapObjStore?.[index];
    if (!map || !opt) return;
    const { script } = opt;
    const fn = script(map);
    fn();
  };
</script>

{#if dropdownOptions.length}
  <div class="action-dropdown">
    Custom actions:
    <select
      id="custom-actions"
      bind:value={selectedDropdown}
      on:change={onClickDropdown}
    >
      {#each dropdownOptions as dropdownAction, i}
        <optgroup label={dropdownAction?.label}>
          <option value={null} disabled selected hidden>Select action...</option
          >
          {#each dropdownAction?.options as dropDownOption, iter}
            <option value={JSON.stringify({ dropdown: i, option: iter })}>
              {dropDownOption?.label}
            </option>
          {/each}
        </optgroup>
      {/each}
    </select>
  </div>
{/if}

<style>
  .action-dropdown {
    margin-top: 0.25rem;
  }
</style>
