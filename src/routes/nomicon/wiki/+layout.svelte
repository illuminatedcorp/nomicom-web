<script lang="ts">
	import { onMount } from 'svelte';
	import { EventBus, Events } from '$lib/eventbus.js';

	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import { useWiki } from '@/models/useWiki';
	const { getWikiIndex, createWikiPage, getWikiCategories, createWikiCategory } = useWiki();

	import { WEB_ROUTES } from '@/models/useConstants.js';
	import { useAuth } from '@/models/useAuth.js';
	const { safeGoto, hasPermission } = useAuth();

	let wikiIndex = [];
	let wikiCategories = [];
	let sidebarData = [];
	let hiddenPages = [];

	onMount(async () => {
		await updateSidebar();
	});

	const gotoPage = (slug) => {
		safeGoto(WEB_ROUTES.wiki + '/' + slug);
	};

	const onNewWikiPage = async () => {
		await createWikiPage();
		await updateSidebar();
		gotoPage('new-page');
	};

	const onNewCategory = async () => {
		await createWikiCategory({ name: 'new-category' });
		await updateSidebar();
	};

	const assembleSidebar = () => {
		const sidebar = {};

		wikiCategories.forEach((category) => {
			if (!sidebar[category.id]) {
				sidebar[category.id] = {
					name: category.name,
					pages: category.wiki_pages || []
				};
			}
		});

		const arrayData = Object.values(sidebar);
		arrayData.sort((a, b) => a.sort_key - b.sort_key);

		return arrayData;
	};

	const updateSidebar = async () => {
		wikiCategories = await getWikiCategories();
		sidebarData = assembleSidebar();

		wikiIndex = await getWikiIndex();
		hiddenPages = wikiIndex.filter((page) => !page.wiki_category_id);
	};

	EventBus.on(Events.UPDATE_WIKI_INDEX, async () => {
		await updateSidebar();
	});
</script>

<div class="flex h-full">
	<div class="flex flex-col items-start bg-background-900 pt-1 pb-3 max-w-56">
		<div class="flex flex-col items-start flex-grow overflow-y-auto overflow-x-hidden px-3 w-full">
			<Button on:click={() => gotoPage('')} variant="link" class="text-md text-background-50 hover:text-primary-50 p-0">Wiki Home</Button>

			<Separator class="mt-2" />

			{#each sidebarData as category}
				<div class="flex flex-col mt-3 w-full">
					<div class="text-sm text-background-200">{category.name}</div>
					<div class="ml-2">
						{#each category.pages as page}
							<Button
								on:click={() => gotoPage(page.slug)}
								variant="link"
								class="flex justify-start text-md text-background-50 hover:text-primary-50 p-0 w-full"
							>
								<span class="truncate transition-none">{page.name}</span>
							</Button>
						{/each}
					</div>
				</div>
			{/each}

			{#if hasPermission('edit_wiki_page')}
				<div class="flex flex-col mt-3 w-full">
					<div class="text-sm text-background-200">Hidden Pages</div>
					<div class="ml-2">
						{#each hiddenPages as page}
							<Button
								on:click={() => gotoPage(page.slug)}
								variant="link"
								class="flex justify-start text-md text-background-50 hover:text-primary-50 p-0 w-full"
							>
								<span class="truncate transition-none">{page.name}</span>
							</Button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		{#if hasPermission('create_wiki_page')}
			<div class="flex flex-col w-full">
				<Separator class="mb-3 bg-background-500" />

				<div class="flex gap-2 px-3">
					<Tooltip.Root openDelay={0}>
						<Tooltip.Trigger>
							<Button on:click={onNewCategory} class="w-full">
								<i class="fas fa-folder-plus"></i>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content class="bg-background-800">
							<div class="text-sm">New category</div>
						</Tooltip.Content>
					</Tooltip.Root>

					<Tooltip.Root openDelay={0}>
						<Tooltip.Trigger>
							<Button on:click={onNewWikiPage} class="w-full">
								<i class="fas fa-file"></i>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content class="bg-background-800">
							<div class="text-sm">New page</div>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</div>
		{/if}
	</div>

	<slot />
</div>
