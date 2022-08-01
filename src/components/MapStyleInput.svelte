<script>
  import { onDestroy, onMount } from 'svelte';
  import {
    maps as mapsStore,
    stylePresets as stylePresetsStore,
    config as configStore,
  } from '../stores';
  import { createBranchUrl, parseBranchUrl } from '../branch-utils';
  import { shortcut } from '../shortcut';
  import { fetchUrl } from '../fetch-url';

  export let index;

  let map;
  let url;
  let name;
  let branch;
  let allowPolling = true;

  let stylePresets;
  let branchPatterns;

  stylePresetsStore.subscribe(value => (stylePresets = value));
  configStore.subscribe(value => ({ branchPatterns } = value));

  let selected;
  let textInput = url;
  let dropdownOptions = {};

  let localUrl = '';
  let focused = false;
  let error = null;

  onDestroy(() => {
    // Cancel any polling in destroyed components
    allowPolling = false;
  });

  const getDropdownOptions = () => {
    const options = {};

    if (stylePresets.length) {
      options['Presets'] = stylePresets.map(item => ({
        ...item,
        dropdownType: 'preset',
        selected: url === item?.url,
      }));
    }
    if (branchPatterns) {
      for (const pattern of branchPatterns) {
        if (pattern?.styles?.length) {
          options[
            `Styles on a branch${pattern.name ? `: ${pattern.name}` : ''}`
          ] = pattern?.styles.map(s => {
            return {
              name: `${s.charAt(0).toUpperCase() + s.slice(1)} on...`,
              id: s,
              type: pattern.type,
              dropdownType: 'branch',
              selected: !!(
                branch && createBranchUrl(pattern.pattern, branch, s) === url
              ),
              pattern: pattern.pattern,
            };
          });
        }
      }
    }

    const hasSelectedOption = Object.values(options)
      .reduce((acc, opt) => acc.concat(opt), [])
      .some(item => !!item.selected);

    options['Custom'] = [
      {
        name: 'Fetch URL at...',
        dropdownType: 'custom',
        selected: !hasSelectedOption,
      },
    ];

    return options;
  };

  onMount(() => {
    // This runs only on mount to check for localhost in url to continuously poll
    poll(url);

    // Set selected and dropdown options on load
    const stylePresetOption = stylePresets.find(s => s.url === url);
    if (stylePresetOption) {
      selected = { ...stylePresetOption, dropdownType: 'preset' };
      textInput = '';
    } else {
      selected = {
        name,
        dropdownType: 'custom',
        url,
      };
      textInput = url;
    }
    dropdownOptions = getDropdownOptions();

    // If it's a branch, grab the appropriate selected dropdown option based on url
    if (branch) {
      const allOptions = Object.values(dropdownOptions).reduce(
        (acc, opt) => acc.concat(opt),
        []
      );
      selected = allOptions.find(item => !!item.selected);
      textInput = branch;
    }
  });

  $: {
    if (textInput !== localUrl && error) {
      localUrl = '';
      error = null;
    }
  }

  // This will continue to poll/fetch the style at a local URL to allow live changes to be picked up
  const poll = url => {
    const pollCondition = str =>
      allowPolling && str && str.includes('localhost') && selected?.url === str;
    // Simple polling for any style on localhost
    // Check that should poll to set timer
    if (pollCondition(url)) {
      // Check poll condition again to cancel action for a url
      setTimeout(() => pollCondition(url) && fetchStyle(url), 3000);
    }
  };

  // Handle updating the map store
  const handleMapStyleUpdate = mapStyle => {
    // Clean up style before dispatching
    const excludedKeys = ['dropdownType', 'selected'];
    let value = {
      ...Object.fromEntries(
        Object.entries(mapStyle).filter(([k, v]) => !excludedKeys.includes(k))
      ),
      index,
    };
    if (selected.dropdownType === 'branch') {
      value.branch = localUrl;
    }
    if (mapStyle.style) {
      value.id = mapStyle.style.id;
      value.name = mapStyle.style.name;
    }

    mapsStore.update(current => {
      return current.map((m, i) => (i === index ? value : m));
    });
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
    localUrl = textInput;
    const { dropdownType, pattern } = selected;

    let nextLocalUrl =
      dropdownType === 'branch'
        ? // TODO We should sort out selected.id and selected.name here, this works but isn't clear
          createBranchUrl(pattern, localUrl, selected.id || selected.name)
        : localUrl;
    if (url === nextLocalUrl) return;
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

  const handleSelect = val => {
    selected = val;
    const { dropdownType } = val;
    switch (dropdownType) {
      case 'preset': {
        const { type, url } = val;
        if (type === 'google') {
          handleMapStyleUpdate(val);
          break;
        }
        textInput = '';
        onChangeUrl(url);
        break;
      }
      case 'branch': {
        if (textInput && textInput === branch) {
          submitUrl();
        } else {
          textInput = '';
        }
        break;
      }
      case 'custom': {
        textInput = url;
        break;
      }
    }

    // Set selected option in the dropdown options
    const nextDropdownOptions = Object.entries(dropdownOptions).reduce(
      (acc, kv) => {
        const [k, v] = kv;
        acc[k] = v.map(option => {
          const isNextSelected = Object.entries(option).every(entry => {
            const [key, val] = entry;
            if (key === 'selected') return true;
            return val === selected[key];
          });
          if (isNextSelected) {
            return {
              ...option,
              selected: true,
            };
          } else {
            return {
              ...option,
              selected: false,
            };
          }
        });
        return acc;
      },
      {}
    );

    dropdownOptions = nextDropdownOptions;
  };

  mapsStore.subscribe(maps => {
    map = maps.find(m => m.index === index);
    if (map) {
      branch = map.branch;
      name = map.name;
      url = map.url;
    }
  });

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
    if (selected.dropdownType === 'branch' && selected.url) {
      textInput = branch;
    } else if (selected.dropdownType === 'branch' && !selected.url) {
      textInput = '';
    } else {
      textInput = url;
    }
  };
</script>

<div class="map-style-input">
  <select id="styles" on:change={e => handleSelect(JSON.parse(e.target.value))}>
    {#each Object.keys(dropdownOptions) as group}
      <optgroup value={group} label={group}>
        {#each dropdownOptions[group] as style}
          <option value={JSON.stringify(style)} selected={style.selected}
            >{style.name}</option
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
        disabled={url === textInput}>Submit</button
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
