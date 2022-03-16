<script>
  import { createEventDispatcher } from 'svelte';
  import { shortcut } from '../shortcut'
  import { fetchUrl } from '../fetch-url';

  const dispatch = createEventDispatcher();

  let selected = null;
  let textInput = '';
  let localUrl = '';
  let activeStyleUrl = '';
  let focused = false;
  let error = null;

  const poll = (url) => {
    const pollCondition = (str) => str.includes('localhost') && activeStyleUrl === str;
    // Simple polling for any style on localhost
    // Check that should poll to set timer
    if (pollCondition(url)) {
      // Check poll condition again to cancel action for a url
      setTimeout(() => pollCondition(url) && fetchStyle(url), 3000)
    }
  }

  const fetchStyle = async function (url) {
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

  const submitUrl = async () => {
    localUrl = textInput;
    if (activeStyleUrl === localUrl) return;
    const { status } = await fetchStyle(localUrl);
    if (status === '200') {
      activeStyleUrl = localUrl;
      // Call poll after setting activeStyleUrl on success
      poll(localUrl);
    }
  };

  const onKeySubmit = () => {
    if (focused) {
      submitUrl();
    }
  }

  const handleOnFocus = () => {
    focused = true;
  }

  const handleOnBlur = () => {
    focused = false;
    if (error) {
      textInput = activeStyleUrl;
    }
  };

  $: {
    if (textInput !== localUrl && error) {
      localUrl = '';
      error = null;
    }
  }
</script>

<div class="map-style-input">
  <select id="styles" bind:value={selected}>
    <option value="custom">Custom</option>
  </select>

  {#if selected === 'custom'}
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
