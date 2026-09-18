<script>
  import { createBranchUrl } from '../branch-utils';
  import { shortcut } from '../shortcut';
  import { fetchUrl } from '../fetch-url';

  // Renders the free-text URL/branch-name entry for the 'branch' and
  // 'custom' option kinds — fetching the style at that URL once on submit
  // and reporting the result back up. Ongoing localhost polling is handled
  // centrally by MapStyleInputWrapper (see style-polling.js) for whatever's
  // actually applied to the map, regardless of which kind of option it came
  // from — this only knows how to turn a freshly-submitted URL into a
  // fetched style.
  let { option, onApply } = $props();

  let textInput = $state(option.defaultText);
  let focused = $state(false);
  let error = $state(null);

  // Re-seed the input text whenever a *different* option is selected (not
  // on every re-render of the same one, so the user's in-progress typing
  // isn't clobbered).
  let lastOptionKey = option.key;
  $effect(() => {
    if (option.key !== lastOptionKey) {
      lastOptionKey = option.key;
      textInput = option.defaultText;
      error = null;
    }
  });

  const submitUrl = async () => {
    let nextUrl =
      option.kind === 'branch'
        ? createBranchUrl(option.pattern, textInput, option.branchStyle)
        : textInput;

    if (option.url === nextUrl) return;

    // Fetch doesn't accept a bare `localhost` unless prefaced with http://
    if (nextUrl.includes('localhost')) {
      const [preface, address] = nextUrl.split('localhost');
      if (!preface) {
        nextUrl = `http://localhost${address}`;
      }
    }

    try {
      const style = await fetchUrl(nextUrl);
      onApply({
        ...option,
        url: nextUrl,
        style,
        ...(option.kind === 'branch' && { branch: textInput }),
      });
    } catch (err) {
      error = new Error(err.message);
    }
  };

  const onKeySubmit = () => {
    if (focused) submitUrl();
  };

  const handleFocus = () => (focused = true);
  const handleBlur = () => {
    focused = false;
    if (error) textInput = option.defaultText;
  };
</script>

<div class="custom-input">
  <input
    class:input-error={error}
    bind:value={textInput}
    oninput={() => (error = null)}
    onfocus={handleFocus}
    onblur={handleBlur}
    placeholder={option.kind === 'branch'
      ? 'enter a branch name'
      : 'enter a url to a style'}
  />
  <button
    use:shortcut={{ code: 'Enter', callback: onKeySubmit }}
    onclick={submitUrl}
    disabled={option.url === textInput}
  >
    Submit
  </button>
</div>
{#if error}
  <div class="error-message">{error}</div>
{/if}

<style>
  .custom-input {
    margin-top: 0px;
    display: flex;
    flex-wrap: nowrap;
    gap: 0.25rem;
  }

  .custom-input input {
    flex-grow: 1;
    width: 0;
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
