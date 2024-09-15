<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { useApi } from '$lib/models/useApi.js';
	const { apiGet } = useApi();

	const afterLoginRedirectUrl = '/buyback';

	onMount(async () => {
		// get the code from the url
		let code = new URLSearchParams(window.location.search).get('code');
		let state = new URLSearchParams(window.location.search).get('state');

		// then we strip the query params from the url
		window.history.replaceState({}, document.title, '/');

		if (code && state) {
			console.log('code', code);
			let response = await apiGet('login', { code, state });

			if (response.status === 'ok') {
				console.log('success', response);
				goto('/');
			} else {
				console.error('error', response);
				// TODO what to do on error?
			}
		} else {
			console.log('trying to goto login');
			// if they don't have a code, we send them to the login route
			goto('/login');
		}
	});
</script>

<div>Please wait...</div>
