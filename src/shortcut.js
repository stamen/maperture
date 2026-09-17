// See https://svelte.dev/repl/acd92c9726634ec7b3d8f5f759824d15?version=3.46.4 for more info
export const shortcut = (node, params) => {
  let handler;
  const removeHandler = () => window.removeEventListener('keydown', handler),
    setHandler = () => {
      removeHandler();
      if (!params) return;
      handler = e => {
        if (
          !!params.alt != e.altKey ||
          !!params.shift != e.shiftKey ||
          !!params.control != (e.ctrlKey || e.metaKey) ||
          params.code != e.code
        )
          return;
        e.preventDefault();
        params.callback ? params.callback() : node.click();
      };
      window.addEventListener('keydown', handler);
    };
  setHandler();
  return {
    update: setHandler,
    destroy: removeHandler,
  };
};
