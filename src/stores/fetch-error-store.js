import { writable } from 'svelte/store';

const fetchErrorStore = writable(null);

export { fetchErrorStore };
