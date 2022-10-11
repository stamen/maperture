import { writable } from 'svelte/store';

export const maps = writable([]);
export const stylePresets = writable([]);

export const config = writable([]);

export const showDisplays = writable(true);

export const linkLocations = writable(true);

export const mapLocations = writable([]);
