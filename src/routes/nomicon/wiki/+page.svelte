<script>
	import { onMount } from 'svelte';

	import { WEB_ROUTES } from '$lib/models/useConstants';
	import { useAuth } from '$lib/models/useAuth';
	const { safeGoto } = useAuth();

	onMount(() => {
		const targetSlug = localStorage.getItem('wikiSlug');
		if (targetSlug) {
			localStorage.removeItem('wikiSlug');
			gotoPage(targetSlug);
		}
	});

	const gotoPage = (slug) => {
		safeGoto(WEB_ROUTES.wiki + '/' + slug);
	};
</script>

<div class="flex flex-col pl-8 pt-6">
	<div class="text-3xl">Wiki Home</div>

	<div class="text-xl mt-5">Do you have ideas on what we could do with this home page?</div>
	<div class="text-xl mt-1">
		Let us know on Discord in the
		<span class="text-primary-50 bg-background-900 px-2 rounded-sm">#programming</span>
		channel.
	</div>
</div>
