<script>
  import { shortcut } from '../shortcut.js'
  export let onChangeUrl;

  let selected = null;
  let textInput = '';
  let localUrl = '';
  let activeStyleUrl = '';
  let focused = false;
  let error = null;

  const onKeySubmit = () => {
    if (focused) {
      submitUrl();
    }
  }

  const submitUrl = () => {
    localUrl = textInput;
    onChangeUrl(localUrl).then(data => {
      const { url, error: err } = data;
      if (err) {
        error = err;
      } else {
        activeStyleUrl = url;
      }
    });
  };

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
