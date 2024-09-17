<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	import { sessionStore } from '$lib/stores/sessionStore';

	let isAuthenticated = false;

	onMount(() => {
		sessionStore.subscribe(async (session) => {
			let data = await session;

			if (data.isAuthenticated) {
				isAuthenticated = true;
			} else {
				// send them to the login page
				goto(`${base}/portal/login`);
			}
		});
	});
</script>

<div>portal page</div>
