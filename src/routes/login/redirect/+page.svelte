<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	import { toast } from 'svelte-sonner';

	import { useUsers } from '@/models/useUsers';
	const { getUserData } = useUsers();

	import { useApi } from '$lib/models/useApi.js';
	import { API_ROUTES, WEB_ROUTES } from '$lib/models/useConstants';
	const { apiCall } = useApi();

	onMount(async () => {
		// get the code from the url
		let code = new URLSearchParams(window.location.search).get('code');
		let state = new URLSearchParams(window.location.search).get('state');

		let storedState = localStorage.getItem('state');
		if (state !== storedState) {
			// console.error('state mismatch');
			goto(`${base}${WEB_ROUTES.login}`);
		}

		if (code && state) {
			let response = await apiCall(API_ROUTES.login, { auth_code: code });

			if (response) {
				// we need to save the API token to local storage
				await localStorage.setItem('api_token', response.api_token);

				// here we want to refetch the user data
				await getUserData();

				// we may need to check local storage here eventually if the character management section is under a different route

				goto(`${base}${WEB_ROUTES.nomicon}`);
			} else {
				toast.error('There was an error logging in. Please try again.');
				goto(`${base}${WEB_ROUTES.login}`);
			}
		} else {
			// we clear the stored api token from local storage
			localStorage.removeItem('api_token');

			// if they don't have a code, we send them to the login route
			goto(`${base}${WEB_ROUTES.login}`);
		}
	});
</script>

<div></div>
