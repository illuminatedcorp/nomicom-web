<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	import { WEB_ROUTES } from '$lib/models/useConstants';
	import { userStore } from '@/stores/userStore';

	let isAuthenticated = false;

	onMount(() => {
		userStore.subscribe(async (session) => {
			let data = await session;

			if (data.characters.length > 0) {
				isAuthenticated = true;
			} else {
				// send them to the login page
				goto(`${base}${WEB_ROUTES.login}`);
			}
		});
	});
</script>

<slot />
