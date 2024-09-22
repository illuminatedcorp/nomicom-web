import { writable } from 'svelte/store';

export const userStore = writable({
	valid: false,
	characters: []
});
