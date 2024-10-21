<script lang="ts">
	import { onMount } from 'svelte';

	import { WEB_ROUTES } from '$lib/models/useConstants';
	import { useAuth } from '$lib/models/useAuth';
	const { safeGoto } = useAuth();

	onMount(() => {
		const targetSlug = localStorage.getItem('newsSlug');
		if (targetSlug) {
			localStorage.removeItem('newsSlug');
			gotoPage(targetSlug);
		}
	});

	const gotoPage = (slug) => {
		safeGoto(WEB_ROUTES.news + '/' + slug);
	};
</script>

<div class="flex flex-col pl-8 pt-6">
	<div class="text-3xl">News Home</div>

	<div class="text-xl mt-5">Do you have ideas on what we could do with this home page?</div>
	<div class="text-xl mt-1">
		Let Fryke know on Discord in the
		<span class="text-primary-50 bg-background-900 px-2 rounded-sm">#programming</span>
		channel.
	</div>
</div>
