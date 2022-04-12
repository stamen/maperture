// import App from './App.svelte';

// const app = new App({
//   target: document.body,
//   props: {},
// });

// export default app;

import App from './App.svelte';

const startApp = (target, props) =>
  new App({
    target,
    props,
  });

export { startApp };
