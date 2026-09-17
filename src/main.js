import { mount } from 'svelte';
import './global.css';
import App from './App.svelte';

const startApp = (target, props) => mount(App, { target, props });

export { startApp };
