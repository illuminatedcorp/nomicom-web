<script lang="ts">
	import { onMount } from 'svelte';
	import { EventBus, Events } from '$lib/eventbus.js';

	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator';

	import { useWiki } from '@/models/useWiki';
	const { getWikiIndex, createWikiPage } = useWiki();

	import { WEB_ROUTES } from '@/models/useConstants.js';
	import { useAuth } from '@/models/useAuth.js';
	const { safeGoto, hasPermission } = useAuth();

	let wikiIndex = [];

	onMount(async () => {
		wikiIndex = await getWikiIndex();
		console.log(wikiIndex);
	});

	const gotoPage = (slug) => {
		safeGoto(WEB_ROUTES.wiki + '/' + slug);
	};

	const onNewWikiPage = async () => {
		await createWikiPage();
		wikiIndex = await getWikiIndex();
		gotoPage('new-page');
	};

	EventBus.on(Events.UPDATE_WIKI_INDEX, async () => {
		wikiIndex = await getWikiIndex();
	});
</script>

<div class="flex h-full">
	<div class="flex flex-col items-start bg-background-900 pt-1 pb-3 px-3 max-w-48">
		<div class="flex flex-col items-start flex-grow overflow-y-auto">
			<Button
				on:click={() => gotoPage('')}
				variant="link"
				class="text-md text-background-50 hover:text-primary-50 p-0">Wiki Home</Button
			>

			{#each wikiIndex as page}
				<Button
					on:click={() => gotoPage(page.slug)}
					variant="link"
					class="flex justify-start text-md text-background-50 hover:text-primary-50 p-0 w-full"
				>
					<span class="truncate transition-none">{page.name}</span>
				</Button>
			{/each}
		</div>

		{#if hasPermission('admin')}
			<!-- <Separator /> -->
			<Button on:click={onNewWikiPage} class="w-full">+ New Page</Button>
		{/if}
	</div>

	<slot />
</div>
