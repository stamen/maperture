<script>
  import { onDestroy, onMount, createEventDispatcher } from 'svelte';
  import { createBranchUrl } from '../branch-utils';
  import { shortcut } from '../shortcut';
  import { fetchUrl } from '../fetch-url';
  const dispatch = createEventDispatcher();

  export let dropdownDisplayOptions;
  export let dropdownValue;
  export let activeUrl;

  let selected;

  let textInput;

  let focused = false;
  let error = null;

  let allowPolling = true;
  onDestroy(() => {
    // Cancel any polling in destroyed components
    allowPolling = false;
  });

  onMount(() => {
    selected = dropdownValue;
    textInput = selected.defaultText;
    // This runs only on mount to check for localhost in url to continuously poll
    poll(selected.url);
  });

  // This will continue to poll/fetch the style at a local URL to allow live changes to be picked up
  const poll = url => {
    const pollCondition = str => {
      if (!allowPolling || !str || activeUrl !== str) return false;
      const absolutePathRegex = new RegExp('^(?:[a-z+]+:)?//', 'i');
      return str.includes('localhost') || !absolutePathRegex.test(str);
    };

    // Simple polling for any style on localhost
    // Check that should poll to set timer
    if (pollCondition(url)) {
      // Check poll condition again to cancel action for a url
      setTimeout(() => pollCondition(url) && fetchStyle(url), 3000);
    }
  };

  // Handle updating the map store
  const handleMapStyleUpdate = mapObj => {
    // Clean up style before dispatching
    const excludedKeys = ['dropdownType', 'selected'];
    let value = {
      ...Object.fromEntries(
        Object.entries(mapObj).filter(([k, v]) => !excludedKeys.includes(k))
      ),
    };
    if (selected.dropdownType === 'branch') {
      value.branch = textInput;
    }
    if (mapObj.style) {
      value.id = mapObj.style.id;
      value.name = mapObj.style.name;
    }

    dispatch('updateMapStore', { value });
  };

  // Fetch the style json from the URL
  const fetchStyle = async url => {
    let style;
    try {
      const data = await fetchUrl(url);
      // TODO make a better check that it is style and not arbitrary object
      if (data && typeof data === 'object') {
        // TODO create checks by type for non-mapbox maps
        style = data;
        poll(url);
        handleMapStyleUpdate({ ...selected, style, url });
        return { status: '200' };
      }
    } catch (err) {
      error = new Error('Style was not found.');
      return { status: '404' };
    }
  };

  // Change the URL by fetching the style and polling if necessary
  const onChangeUrl = async url => {
    const { status } = await fetchStyle(url);
    if (status === '200') {
      selected.url = url;
      // Call poll after setting selected.url on success
      poll(url);
    }
  };

  // Submit URL from a custom or branch style
  const submitUrl = async () => {
    const { dropdownType, pattern } = selected;

    // Branch values always have an `id` field
    let nextLocalUrl =
      dropdownType === 'branch'
        ? createBranchUrl(pattern, textInput, selected.id)
        : textInput;

    if (selected?.url === nextLocalUrl) return;
    if (nextLocalUrl.includes('localhost')) {
      const [preface, address] = nextLocalUrl.split('localhost');
      // Fetch doesn't accept localhost unless prefaced with http://
      // This adds the preface if not present
      if (!preface) {
        nextLocalUrl = `http://localhost${address}`;
      }
    }
    onChangeUrl(nextLocalUrl);
  };

  const onChangeSelected = () => {
    // If dropdownValue matches our current selected value, return early
    const isSame = Object.entries(dropdownValue).every(kv => {
      const [k, v] = kv;
      if (k === 'url') return true;
      if (selected && selected[k] === v) return true;
    });
    if (isSame) return;

    const prevDropdownType = selected?.dropdownType;
    selected = dropdownValue;
    error = null;
    // Submit the URL or open text input under different conditions
    const { dropdownType } = selected;
    switch (dropdownType) {
      case 'preset': {
        const { type, url } = selected;
        if (type === 'google') {
          handleMapStyleUpdate(selected);
          break;
        }
        onChangeUrl(url);
        break;
      }
      case 'branch': {
        if (textInput && prevDropdownType === 'branch') {
          submitUrl();
        }
        break;
      }
      case 'custom': {
        break;
      }
    }

    textInput = selected.defaultText;
  };

  const onKeySubmit = () => {
    if (focused) {
      submitUrl();
    }
  };

  const handleOnFocus = () => {
    focused = true;
  };

  const handleOnBlur = () => {
    focused = false;
    if (error) {
      textInput = selected.defaultText;
    }
  };

  const resetError = text => {
    if (!error || text === undefined) return;
    error = null;
  };

  // Reset error on beginning to type again
  $: resetError(textInput);

  // When the selected value changes, update text input and potentially fetch style
  $: onChangeSelected(dropdownValue);
</script>

<div class="map-style-input">
  <select
    id="styles"
    on:change={e => dispatch('selectOption', { dropdownId: e.target.value })}
  >
    {#each Object.keys(dropdownDisplayOptions) as group}
      <optgroup value={group} label={group}>
        {#each dropdownDisplayOptions[group] as value}
          <option
            value={value.dropdownId}
            selected={dropdownValue.dropdownId === value.dropdownId}
            >{value.text}</option
          >
        {/each}
      </optgroup>
    {/each}
  </select>

  {#if selected?.dropdownType === 'custom' || selected?.dropdownType === 'branch'}
    <div class="custom-input">
      <input
        class:input-error={error}
        bind:value={textInput}
        on:focus={handleOnFocus}
        on:blur={handleOnBlur}
        placeholder={selected.dropdownType === 'branch'
          ? 'enter a branch name'
          : 'enter a url to a style'}
      />
      <button
        use:shortcut={{ code: 'Enter', callback: onKeySubmit }}
        on:click={submitUrl}
        disabled={selected?.url === textInput}>Submit</button
      >
    </div>
  {/if}
  {#if !!error}
    <div class="error-message">
      {error}
    </div>
  {/if}
</div>

<style>
  .map-style-input {
    margin-top: 6px;
  }

  .custom-input {
    margin-top: 0px;
  }

  .input-error:focus {
    outline: none;
    border-color: red;
  }

  .error-message {
    background-color: lightcoral;
    border-style: solid;
    border-color: red;
    border-width: 1px;
    border-radius: 4px;
    padding: 6px;
    color: white;
  }
</style>
