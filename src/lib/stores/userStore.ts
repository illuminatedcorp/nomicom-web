import { writable } from 'svelte/store';

export const userStore = writable({
	valid: false,
	initialized: false,
	characters: []
});
