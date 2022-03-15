<script>
  import { createEventDispatcher } from 'svelte';
  import { shortcut } from '../shortcut.js'
  const dispatch = createEventDispatcher();
  export let activeUrl;

  let selected = 'custom'; // null;
  let textInput = '';
  let localUrl = null;
  let focused = false;

  const onKeySubmit = () => {
    if (focused) {
      submitUrl();
    }
  }

  const submitUrl = () => {
    if (activeUrl !== textInput) {
      localUrl = textInput;
      handleMapChange(localUrl);
    }
  };

  const handleMapChange = nextUrl => {
    dispatch('mapChange', { nextUrl, prevUrl: activeUrl });
  };

  const handleOnFocus = () => {
    focused = true;
  }

  const handleOnBlur = () => {
    setTimeout(() => {
      textInput = activeUrl;
      focused = false;
    }, 100);
  };
</script>

<div class="map-style-input">
  <select id="styles" bind:value={selected}>
    <option value="custom">Custom</option>
  </select>

  {#if selected === 'custom'}
  <div class='custom-input'>
    <input bind:value={textInput} on:focus={handleOnFocus} on:blur={handleOnBlur} placeholder="enter a url to a style"/>
    <button use:shortcut={{code: 'Enter', callback: onKeySubmit }} on:click={submitUrl}>Submit</button>
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
</style>
