import App from './src/App.svelte';

const startApp = (target, props) =>
  new App({
    target,
    props,
  });

export { startApp };
