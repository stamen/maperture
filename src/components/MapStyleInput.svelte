<script>
  import { fetchErrorStore } from '../stores/fetch-error-store';
  import { shortcut } from '../shortcut.js'
  export let onChangeUrl;

  let selected = null;
  let textInput = '';
  let localUrl = null;
  let focused = false;
  let error = null;

  const onKeySubmit = () => {
    if (focused) {
      submitUrl();
    }
  }

  const submitUrl = () => {
    localUrl = textInput;
    onChangeUrl(localUrl);
  };

  const handleOnFocus = () => {
    focused = true;
  }

  const handleOnBlur = () => {
    setTimeout(() => {
      textInput = error ? '' : localUrl;
      focused = false;
      error = null;
      fetchErrorStore.set(null);
    }, 100);
  };

  $: fetchErrorStore.subscribe(value => {
    if (value && typeof value === 'object') {
      const url = Object.keys(value)[0];
      if (localUrl !== url) return;
      const message = value[url];
      error = message;
    }
	});
</script>

<div class="map-style-input">
  <select id="styles" bind:value={selected}>
    <option value="custom">Custom</option>
  </select>

  {#if selected === 'custom'}
  <div class='custom-input'>
    <input class={`${error && 'input-error'}`} bind:value={textInput} on:focus={handleOnFocus} on:blur={handleOnBlur} placeholder="enter a url to a style"/>
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
