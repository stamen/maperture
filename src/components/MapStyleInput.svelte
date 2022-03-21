<script>
  import { createEventDispatcher } from 'svelte';
  import { stylePresets, branchPattern } from '../config';
  import { isBranchUrl, parseBranchUrl, createBranchUrl } from '../branch-utils';
  import { shortcut } from '../shortcut'
  import { fetchUrl } from '../fetch-url';

  const dispatch = createEventDispatcher();

  export let url;

  const selectedIsStyleOption = stylePresets.some(s => s.url === url);
  const selectedIsBranchOption = isBranchUrl(url);
  
  let selected = 'custom';
  let textInput = url;
  if (selectedIsStyleOption) {
    selected = url
    textInput = '';
  }
  if (selectedIsBranchOption) {
    const { styleId, branch } = parseBranchUrl(url)
    selected = `branchStyle-${styleId}`;
    textInput = branch;
  }
  let localUrl = '';
  let activeStyleUrl = '';
  let focused = false;
  let error = null;

  $: {
    // This runs only on mount to check for localhost in url
    if (!activeStyleUrl) {
      activeStyleUrl = url;
      poll(url);
    }
  };

  $: {
    if (textInput !== localUrl && error) {
      localUrl = '';
      error = null;
    }
  };

  $: {
    if (selected === 'custom') {
      textInput = url;
    } else if (selected.includes('branchStyle-')) {
      textInput = '';
    } else if (selected) {
      textInput = '';
      onChangeUrl(selected);
    }
  };

  const poll = (url) => {
    const pollCondition = (str) => str.includes('localhost') && activeStyleUrl === str;
    // Simple polling for any style on localhost
    // Check that should poll to set timer
    if (pollCondition(url)) {
      // Check poll condition again to cancel action for a url
      setTimeout(() => pollCondition(url) && fetchStyle(url), 3000)
    }
  }

  const fetchStyle = async (url) => {
    let style;
    try {
      const data = await fetchUrl(url);
      // TODO make a better check that it is style and not arbitrary object
      if (data && typeof data === 'object') {
        // TODO create checks by type for non-mapbox maps
        style = data;
        poll(url);
        dispatch('mapStyleUpdate', { style, url });
        return { status: '200' };
      }
    } catch (err) {
      error = new Error('Style was not found.');
      return { status: '404' };
    }
  };
  
  const onChangeUrl = async (url) => {
    let nextUrl = url;
    if (selected.includes('branchStyle-')) {
      const styleId = selected.replace('branchStyle-', '');
      nextUrl = createBranchUrl(url, styleId);
    }
    const { status } = await fetchStyle(nextUrl);
    if (status === '200') {
      // Don't use the altered url for activeStyleUrl since we want branch names here
      activeStyleUrl = url;
      // Call poll after setting activeStyleUrl on success
      poll(nextUrl);
    }
  };

  const submitUrl = async () => {
    localUrl = textInput;
    if (activeStyleUrl === localUrl) return;
    if (localUrl.includes('localhost')) {
      const [preface, address] = localUrl.split('localhost');
      // Fetch doesn't accept localhost unless prefaced with http://
      // This adds the preface if not present
      if (!preface) {
        localUrl = `http://localhost${address}`;
      }
    }
    onChangeUrl(localUrl);
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
      textInput = activeStyleUrl;
    }
  };

  const getDropdownOptions = () => {
    const options = {};
    if (stylePresets.length) {
      options['Presets'] = stylePresets;
    }
    if (branchPattern?.styles) {
      options['Styles on a branch'] = branchPattern?.styles.map(s => {
        return {
          name: `${s.charAt(0).toUpperCase() + s.slice(1)} on...`,
          url: `branchStyle-${s}`
        }
      });
    }
    options['custom'] = [
      {
        name: 'Fetch URL at...',
        url: 'custom'
      }
    ];
    return options;
  };
</script>

<div class="map-style-input">
  <select id="styles" bind:value={selected}>
    {#each Object.keys(getDropdownOptions()) as group}
      <optgroup label={group}>
        {#each getDropdownOptions()[group] as style}
          <option value={style.url}>{style.name}</option>
        {/each}
      </optgroup>
    {/each}
  </select>

  {#if selected === 'custom' || selected.includes('branchStyle-')}
    <div class='custom-input'>
      <input class:input-error={error} bind:value={textInput} on:focus={handleOnFocus} on:blur={handleOnBlur} placeholder="enter a url to a style"/>
      <button class='' use:shortcut={{code: 'Enter', callback: onKeySubmit }} on:click={submitUrl}>Submit</button>
    </div>
  {/if}
  {#if !!error}
  <div class='error-message'>
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
