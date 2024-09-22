<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	import { WEB_ROUTES } from '$lib/models/useConstants';
	import { userStore } from '@/stores/userStore';

	onMount(() => {
		userStore.subscribe(async (data) => {
			let userData = await data;

			if (!userData.valid) {
				// send them to the login page
				goto(`${base}${WEB_ROUTES.login}`);
			}
		});
	});
</script>

<slot />
