import App from './App.svelte';

const startApp = (target, props) =>
  new App({
    target,
    props,
  });

export { startApp };
