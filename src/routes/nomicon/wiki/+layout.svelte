<script lang="ts">
	import { onMount } from 'svelte';
	import { EventBus, Events } from '$lib/eventbus.js';

	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Input from '@/components/ui/input/input.svelte';

	import { useWiki } from '@/models/useWiki';
	const { getWikiIndex, createWikiPage, getWikiCategories, createWikiCategory, saveWikiCategory, deleteWikiCategory } = useWiki();

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
					id: category.id,
					name: category.name,
					sort_key: category.sort_key,
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

	const onSaveCategory = async (category) => {
		const newCategoryData = {
			id: category.id,
			sort_key: category.sort_key,
			name: category.name
		};

		await saveWikiCategory(newCategoryData);
		await updateSidebar();
	};

	const onDeleteCategory = async (categoryId) => {
		await deleteWikiCategory(categoryId);
		await updateSidebar();
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
					<div class="flex items-center justify-between">
						<div class="text-sm text-background-200">{category.name}</div>

						{#if hasPermission('update_wiki_category')}
							<Popover.Root>
								<Popover.Trigger asChild let:builder>
									<Button builders={[builder]} variant="ghost" class="px-1 py-1 h-fit">
										<i class="fas fa-cog text-xs"></i>
									</Button>
								</Popover.Trigger>
								<Popover.Content class="bg-background-800 text-background-50" side="right">
									<div class="flex flex-col gap-2">
										<div class="flex items-center justify-between">
											<div class="font-medium leading-none mb-3">Edit Category</div>
											{#if hasPermission('delete_wiki_category')}
												<Popover.Close>
													<Button on:click={() => onDeleteCategory(category.id)} class="text-xs text-background-50 p-2 h-fit">
														<i class="fas fa-trash"></i>
													</Button>
												</Popover.Close>
											{/if}
										</div>
										<div class="flex gap-2 items-center">
											<span>Name:</span>
											<Input bind:value={category.name} class="col-span-2 h-8" />
										</div>
										<div class="flex gap-2 items-center">
											<span>Sort:</span>

											<Input bind:value={category.sort_key} class="col-span-2 h-8" />
										</div>
										<div class="flex gap-3 mt-3">
											<Popover.Close class="flex-grow">
												<Button on:click={() => onSaveCategory(category)} class="w-full">Save</Button>
											</Popover.Close>
											<Popover.Close class="flex-grow">
												<Button on:click={() => updateSidebar()} class="w-full">Cancel</Button>
											</Popover.Close>
										</div>
									</div>
								</Popover.Content>
							</Popover.Root>
						{/if}
					</div>
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

		{#if hasPermission('create_wiki_page') || hasPermission('create_wiki_category')}
			<div class="flex flex-col w-full">
				<Separator class="mb-3 bg-background-500" />

				<div class="flex gap-2 px-3">
					{#if hasPermission('create_wiki_category')}
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
					{/if}

					{#if hasPermission('create_wiki_page')}
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
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<slot />
</div>
