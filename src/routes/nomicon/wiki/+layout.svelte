<script lang="ts">
	import { onMount } from 'svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator';

	import { useBirdhouse } from '@/models/useBirdhouse.js';
	const { getWikiIndex } = useBirdhouse();

	import { WEB_ROUTES } from '@/models/useConstants.js';
	import { useAuth } from '@/models/useAuth.js';
	const { safeGoto } = useAuth();

	let wikiIndex = [];

	onMount(async () => {
		wikiIndex = await getWikiIndex();
		console.log(wikiIndex);
	});

	const gotoPage = (slug) => {
		safeGoto(WEB_ROUTES.wiki + '/' + slug);
	};
</script>

<div class="flex h-full">
	<div class="flex flex-col items-start bg-background-900 pt-1 px-3">
		<Button
			on:click={() => gotoPage('')}
			variant="link"
			class="text-md text-background-50 hover:text-primary-50 p-0">Wiki Home</Button
		>

		{#each wikiIndex as page}
			<Button
				on:click={() => gotoPage(page.slug)}
				variant="link"
				class="text-md text-background-50 hover:text-primary-50 p-0">{page.title}</Button
			>
		{/each}
	</div>

	<slot />
</div>
