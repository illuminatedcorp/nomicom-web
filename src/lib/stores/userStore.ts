import { writable } from 'svelte/store';

export const userStore = writable({
	id: null,
	valid: false,
	initialized: false,
	characters: [],
	roles: [],
	hasValidWardenCheck: false
});
