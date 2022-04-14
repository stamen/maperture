<script>
  import {
    maps as mapsStore,
    stylePresets as stylePresetsStore,
  } from '../stores';
  import { branchPattern } from '../config';
  import { createBranchUrl } from '../branch-utils';
  import { shortcut } from '../shortcut';
  import { fetchUrl } from '../fetch-url';

  export let index;

  let url;
  let name;
  let branch;

  mapsStore.subscribe(maps => {
    branch = maps[index].branch;
    name = maps[index].name;
    url = maps[index].url;
  });

  let stylePresets;

  stylePresetsStore.subscribe(value => (stylePresets = value));

  let stylePresetOption = {};
  $: stylePresetOption = stylePresets && stylePresets.find(s => s.url === url);

  let selected = {
    name,
    dropdownType: 'custom',
    url,
  };
  let textInput = url;

  const setSelected = () => {
    if (stylePresetOption) {
      selected = { ...stylePresetOption, dropdownType: 'preset' };
      textInput = '';
    }
    if (branch) {
      selected = {
        name,
        dropdownType: 'branch',
        url,
      };
      textInput = branch;
    }
  };

  $: if (stylePresets) setSelected();

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
      str && str.includes('localhost') && selected.url === str;
    // Simple polling for any style on localhost
    // Check that should poll to set timer
    if (pollCondition(url)) {
      // Check poll condition again to cancel action for a url
      setTimeout(() => pollCondition(url) && fetchStyle(url), 3000);
    }
  };

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

  const onChangeUrl = async url => {
    const { status } = await fetchStyle(url);
    if (status === '200') {
      selected.url = url;
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
        textInput = '';
        break;
      }
      case 'custom': {
        textInput = url;
        break;
      }
    }
  };

  let dropdownOptions = {};

  const getDropdownOptions = () => {
    const options = {};
    if (stylePresets.length) {
      options['Presets'] = stylePresets.map(item => ({
        ...item,
        dropdownType: 'preset',
        selected:
          selected.dropdownType === 'preset' && selected?.url === item?.url,
      }));
    }
    if (branchPattern?.styles?.length) {
      options['Styles on a branch'] = branchPattern?.styles.map(s => {
        return {
          name: `${s.charAt(0).toUpperCase() + s.slice(1)} on...`,
          id: s,
          type: branchPattern.type,
          dropdownType: 'branch',
          selected: branch && createBranchUrl(branch, s) === selected.url,
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

  $: if (stylePresets) dropdownOptions = getDropdownOptions();

  // This runs only on mount to check for localhost in url
  poll(url);
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
