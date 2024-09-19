<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	import { useApi } from '$lib/models/useApi.js';
	import { API_ROUTES, WEB_ROUTES } from '$lib/models/useConstants';
	const { apiCall } = useApi();

	onMount(async () => {
		// get the code from the url
		let code = new URLSearchParams(window.location.search).get('code');
		let state = new URLSearchParams(window.location.search).get('state');

		let storedState = localStorage.getItem('state');
		if (state !== storedState) {
			console.error('state mismatch');
			goto(`${base}${WEB_ROUTES.login}`);
		}

		console.log('Auth code from EVE:', code);

		if (code && state) {
			let response = await apiCall(API_ROUTES.login, { auth_code: code });

			if (response?.status === 200) {
				goto(`${base}${WEB_ROUTES.portal}`);
			} else {
				console.error('error', response);
				// TODO what to do on error?
				goto(`${base}${WEB_ROUTES.login}`);
			}
		} else {
			// if they don't have a code, we send them to the login route
			goto(`${base}${WEB_ROUTES.login}`);
		}
	});
</script>

<div class="px-2 py-1">Please wait...</div>
