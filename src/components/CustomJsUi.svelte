<script>
  import { config as configStore, mapObj as mapObjStore } from '../stores';

  export let mapId;
  export let mapIdIndex;

  let mapObj;
  let mounted = false;

  mapObjStore.subscribe(state => {
    const index = mapIdIndex.split('-').pop();
    mapObj = state?.[index];
  });

  const { customJs } = $configStore;

  $: validActions = customJs.filter(js => js.mapIds.includes(mapId));

  $: dropdownOptions = validActions.filter(ui => ui.type === 'dropdown');

  $: checkboxOptions = validActions.filter(ui => ui.type === 'checkbox');

  let selectedDropdown = null;

  $: {
    if (!dropdownOptions.length) {
      selectedDropdown = null;
    }
  }

  const onClickDropdown = e => {
    const { dropdown, option } = JSON.parse(e.target.value);
    const opt = dropdownOptions?.[dropdown]?.options?.[option];
    if (!mapObj || !opt) return;
    const { script } = opt;
    const fn = script(mapObj);
    fn();
  };

  const onClickCheckbox = script => {
    const index = mapIdIndex.split('-').pop();
    if (!mapObj || !script) return;
    const fn = script(mapObj);
    fn();
  };

  const getInitialCheck = checked => {
    // checked is either a boolean or a factory fn
    if (typeof checked === 'boolean') {
      return checked;
    }
    if (!mapObj || !checked) return;
    const fn = checked(mapObj);
    return fn();
  };

  $: if (mapObj) {
    mapObj.on('style.load', () => {
      mounted = true;
    });
  }
</script>

{#if mounted}
  {#if validActions.length}
    <div class="action-dropdown">Custom actions:</div>
  {/if}

  <div class="controls">
    {#if dropdownOptions.length}
      <select
        id="custom-actions"
        bind:value={selectedDropdown}
        on:change={onClickDropdown}
      >
        {#each dropdownOptions as dropdownAction, i}
          <optgroup label={dropdownAction?.label}>
            <option value={null} disabled selected hidden
              >Select action...</option
            >
            {#each dropdownAction?.options as dropDownOption, iter}
              <option value={JSON.stringify({ dropdown: i, option: iter })}>
                {dropDownOption?.label}
              </option>
            {/each}
          </optgroup>
        {/each}
      </select>
    {/if}

    {#if checkboxOptions.length}
      <div class="checkbox-container">
        {#each checkboxOptions as checkboxAction, i}
          <div class="checkbox-options">
            <div class="checkbox-label">{checkboxAction?.label}:</div>
            {#each checkboxAction?.options as checkboxOption, iter}
              <input
                type="checkbox"
                id={iter}
                checked={getInitialCheck(checkboxOption?.checked)}
                on:click={() => onClickCheckbox(checkboxOption?.script)}
              />
              <label for={iter}>{checkboxOption?.label}</label>
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .action-dropdown {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .checkbox-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .checkbox-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
</style>
