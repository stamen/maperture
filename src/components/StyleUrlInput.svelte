<script>
  import { onDestroy, onMount } from 'svelte';
  import { createBranchUrl } from '../branch-utils';
  import { shortcut } from '../shortcut';
  import { fetchUrl } from '../fetch-url';

  // Renders the free-text URL/branch-name entry for the 'branch' and
  // 'custom' option kinds — fetching the style at that URL, polling it while
  // it's served from localhost (so local style edits show up live), and
  // reporting the result back up. The parent (MapStyleInput) owns what
  // "apply this to the map" means; this only knows how to turn a URL into a
  // fetched style.
  let { option, activeUrl, onApply } = $props();

  let textInput = $state(option.defaultText);
  let focused = $state(false);
  let error = $state(null);
  let allowPolling = true;

  onDestroy(() => {
    allowPolling = false;
  });

  onMount(() => {
    // Continue polling if the style already applied to the map (before this
    // component mounted) happens to be a local one.
    poll(option.url);
  });

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

  const isLocalUrl = url => {
    const absolutePathRegex = /^(?:[a-z+]+:)?\/\//i;
    return url.includes('localhost') || !absolutePathRegex.test(url);
  };

  const poll = url => {
    const pollCondition = str =>
      allowPolling && !!str && activeUrl === str && isLocalUrl(str);

    if (pollCondition(url)) {
      setTimeout(() => pollCondition(url) && fetchStyle(url, true), 3000);
    }
  };

  const fetchStyle = async (url, isPolling = false) => {
    try {
      const data = await fetchUrl(url);
      if (data && typeof data === 'object') {
        poll(url);
        if (isPolling) {
          // The map already has the right url/type/branch from the initial
          // apply below; a poll only needs to refresh the style content.
          onApply({ style: data, isPolling: true });
        } else {
          onApply({
            ...option,
            url,
            style: data,
            ...(option.kind === 'branch' && { branch: textInput }),
          });
        }
        return { status: '200' };
      }
    } catch (err) {
      error = new Error(err.message);
      return { status: err.status };
    }
  };

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

    const { status } = await fetchStyle(nextUrl);
    if (status === '200') poll(nextUrl);
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
