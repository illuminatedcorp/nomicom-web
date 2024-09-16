import { writable } from 'svelte/store';

export const sessionStore = writable({
	id: null,
	name: null,
	sessionId: null,
	isAuthenticated: false,
	admin: false,
	loading: false,
	error: null
});
