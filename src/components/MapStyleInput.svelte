<script>
  import { createEventDispatcher } from 'svelte';
  import { stylePresets, branchPattern } from '../config';
  import { createBranchUrl } from '../branch-utils';
  import { shortcut } from '../shortcut';
  import { fetchUrl } from '../fetch-url';

  const dispatch = createEventDispatcher();

  export let url;
  export let name;
  export let branch;

  const stylePresetOption = stylePresets.find(s => s.options.url === url);

  let selected = {
    name,
    dropdownType: 'custom',
    options: { url },
  };
  let textInput = url;

  if (stylePresetOption) {
    selected = { ...stylePresetOption, dropdownType: 'preset' };
    textInput = '';
  }
  if (branch) {
    selected = {
      name,
      dropdownType: 'branch',
      options: { url },
    };
    textInput = branch;
  }

  let localUrl = '';
  let focused = false;
  let error = null;

  $: {
    if (textInput !== localUrl && error) {
      localUrl = '';
      error = null;
    }
  }

  const poll = url => {
    const pollCondition = str =>
      str && str.includes('localhost') && selected.options.url === str;
    // Simple polling for any style on localhost
    // Check that should poll to set timer
    if (pollCondition(url)) {
      // Check poll condition again to cancel action for a url
      setTimeout(() => pollCondition(url) && fetchStyle(url), 3000);
    }
  };

  const dispatchMapStyleUpdate = (style, options) => {
    // Clean up style before dispatching
    const excludedKeys = [
      'dropdownType',
      'selected',
      'style',
      'url',
      'googleMapId',
    ];
    let value = {
      ...Object.fromEntries(
        Object.entries(style).filter(([k, v]) => !excludedKeys.includes(k))
      ),
      options,
    };
    if (selected.dropdownType === 'branch') {
      value.options.branch = localUrl;
    }
    if (options.style) {
      value.id = options.style.id;
      value.name = options.style.name;
    }

    dispatch('mapStyleUpdate', value);
  };

  const fetchStyle = async url => {
    let style;
    try {
      const data = await fetchUrl(url);
      // TODO make a better check that it is style and not arbitrary object
      if (data && typeof data === 'object') {
        // TODO create checks by type for non-mapbox maps
        style = data;
        poll(url);
        dispatchMapStyleUpdate(selected, { style, url });
        return { status: '200' };
      }
    } catch (err) {
      error = new Error('Style was not found.');
      return { status: '404' };
    }
  };

  const onChangeUrl = async url => {
    const { status } = await fetchStyle(url);
    if (status === '200') {
      selected.options.url = url;
      // Call poll after setting selected.url on success
      poll(url);
    }
  };

  const submitUrl = async () => {
    localUrl = textInput;
    const { dropdownType } = selected;
    let nextLocalUrl =
      dropdownType === 'branch'
        ? createBranchUrl(localUrl, selected.id)
        : localUrl;
    if (selected?.options?.url === nextLocalUrl) return;
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

    if (!error) return;

    // If there's an error, reset textInput
    if (selected.dropdownType === 'branch' && selected.options.url) {
      textInput = branch;
    } else if (selected.dropdownType === 'branch' && !selected.options.url) {
      textInput = '';
    } else {
      textInput = url;
    }
  };

  const handleSelect = val => {
    selected = val;
    const { dropdownType } = val;
    switch (dropdownType) {
      case 'preset': {
        const { type } = val;
        const { url } = val.options;
        if (type === 'google') {
          dispatchMapStyleUpdate(val, val.options);
          break;
        }
        textInput = '';
        onChangeUrl(url);
        break;
      }
      case 'branch': {
        textInput = '';
        break;
      }
      case 'custom': {
        textInput = url;
        break;
      }
    }
  };

  const getDropdownOptions = () => {
    const options = {};
    if (stylePresets.length) {
      options['Presets'] = stylePresets.map(item => ({
        ...item,
        dropdownType: 'preset',
        selected:
          selected.dropdownType === 'preset' &&
          selected.options.url === item.options.url,
      }));
    }
    if (branchPattern?.styles?.length) {
      options['Styles on a branch'] = branchPattern?.styles.map(s => {
        return {
          name: `${s.charAt(0).toUpperCase() + s.slice(1)} on...`,
          id: `${s}`,
          dropdownType: 'branch',
          selected:
            branch && createBranchUrl(branch, s) === selected.options.url,
        };
      });
    }
    options['Custom'] = [
      {
        name: 'Fetch URL at...',
        dropdownType: 'custom',
        selected: selected.dropdownType === 'custom',
      },
    ];
    return options;
  };

  // This runs only on mount to check for localhost in url
  poll(url);
</script>

<div class="map-style-input">
  <select id="styles" on:change={e => handleSelect(JSON.parse(e.target.value))}>
    {#each Object.keys(getDropdownOptions()) as group}
      <optgroup value={group} label={group}>
        {#each getDropdownOptions()[group] as style}
          <option value={JSON.stringify(style)} selected={style.selected}
            >{style.name}</option
          >
        {/each}
      </optgroup>
    {/each}
  </select>

  {#if selected.dropdownType === 'custom' || selected.dropdownType === 'branch'}
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
        on:click={submitUrl}>Submit</button
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
