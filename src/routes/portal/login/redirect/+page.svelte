<script lang="ts">
	import { onMount } from 'svelte';
	import { goto, replaceState } from '$app/navigation';
	import { base } from '$app/paths';

	import { useApi } from '$lib/models/useApi.js';
	import { API_ROUTES } from '$lib/models/useConstants';
	const { apiCall } = useApi();

	onMount(async () => {
		// get the code from the url
		let code = new URLSearchParams(window.location.search).get('code');
		let state = new URLSearchParams(window.location.search).get('state');

		// then we strip the query params from the url
		// replaceState('/');

		if (code && state) {
			let response = await apiCall(API_ROUTES.login, { code, state });

			if (response.status === 200) {
				goto(`${base}/portal`);
			} else {
				console.error('error', response);
				// TODO what to do on error?
				goto(`${base}/portal/login`);
			}
		} else {
			// if they don't have a code, we send them to the login route
			goto(`${base}/portal/login`);
		}
	});
</script>

<div>Please wait...</div>
