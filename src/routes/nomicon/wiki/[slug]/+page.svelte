<script lang="ts">
	import 'github-markdown-css';

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { marked } from 'marked';
	import { EventBus, Events } from '$lib/eventbus.js';

	import Button from '$lib/components/ui/button/button.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import Input from '@/components/ui/input/input.svelte';
	import SearchSelect from '@/components/ui/SearchSelect.svelte';

	import { useWiki } from '@/models/useWiki';
	const { getWikiPage, saveWikiPage, deleteWikiPage, getWikiCategories } = useWiki();

	import { WEB_ROUTES } from '@/models/useConstants.js';
	import { useAuth } from '@/models/useAuth.js';

	const { safeGoto, hasPermission } = useAuth();

	import { SEARCH_TYPES } from '$lib/models/useSearch.js';

	let slug;
	let pageData;
	let editMode = false;
	let content = '';
	let categories = [];
	let selectedCategoryId = null;
	let currentWikiCategory = null;

	onMount(async () => {
		slug = $page.params.slug;
		pageData = await getWikiPage(slug);
		if (pageData === null) {
			safeGoto(WEB_ROUTES.wiki);
		}

		content = pageData.body;
		categories = await getWikiCategories();
		selectedCategoryId = pageData.wiki_category_id;
		currentWikiCategory = categories.find((category) => category.id === selectedCategoryId);
	});

	$: {
		slug = $page.params.slug;
		loadPageData();
	}

	const loadPageData = async () => {
		pageData = await getWikiPage(slug);

		if (pageData === null) {
			safeGoto(WEB_ROUTES.wiki);
		}

		content = pageData.body;
		selectedCategoryId = pageData.wiki_category_id;
		currentWikiCategory = categories.find((category) => category.id === selectedCategoryId);
	};

	const onEditPage = () => {
		editMode = true;
	};

	const onSavePage = async () => {
		const newPageData = {
			...pageData,
			body: content,
			sort_key: pageData.sort_key || 0,
			wiki_category_id: selectedCategoryId
		};

		const newSavedData = await saveWikiPage(newPageData);
		if (newSavedData !== null) {
			pageData = newSavedData;
			content = newSavedData.body;
			currentWikiCategory = categories.find((category) => category.id === selectedCategoryId);

			toast.success('Page saved');

			editMode = false;
			EventBus.emit(Events.UPDATE_WIKI_INDEX);

			// and we want to update the URL
			safeGoto(WEB_ROUTES.wiki + '/' + pageData.slug);
		}
	};

	const onDeletePage = async () => {
		const deleted = await deleteWikiPage(pageData.id);
		if (deleted) {
			toast.success('Page deleted');
			EventBus.emit(Events.UPDATE_WIKI_INDEX);
			// send them back to the wiki home
			safeGoto(WEB_ROUTES.wiki);
		}
	};

	const onCancelEdit = () => {
		editMode = false;

		content = pageData.body;
		selectedCategoryId = pageData.wiki_category_id;
	};

	const onSelectCategory = (event) => {
		selectedCategoryId = event.detail.id;
	};
</script>

<div class="flex pl-8 h-full">
	<div class="flex flex-col w-full pt-4 pr-8 {editMode ? 'overflow-visible' : 'overflow-y-auto'}">
		<div class="flex items-center justify-between">
			<div class="text-base font-semibold text-background-200">
				{#if pageData}
					{#if editMode}
						<div class="flex items-center gap-5 mb-1">
							<div class="w-48 -ml-3">
								<SearchSelect
									bind:value={pageData.category}
									type={SEARCH_TYPES.WIKI_CATEGORY}
									on:selected={(event) => onSelectCategory(event)}
								></SearchSelect>
							</div>

							<div class="flex items-center gap-1 h-full">
								<div>Slug:</div>
								<Input bind:value={pageData.slug} class="text-base bg-background-800 flex-grow-0 w-fit  border-0"></Input>
							</div>

							<div class="flex items-center gap-1 h-full">
								<div>Sort Order:</div>
								<Input bind:value={pageData.sort_key} type="number" class="text-base bg-background-800 flex-grow-0 w-fit  border-0"></Input>
							</div>
						</div>
					{:else if currentWikiCategory}
						{currentWikiCategory.name}
					{:else}
						Hidden page
					{/if}
				{/if}
			</div>

			{#if hasPermission('update_wiki_page') || hasPermission('delete_wiki_page')}
				<div class="flex gap-2">
					{#if editMode}
						<Button on:click={onSavePage} variant="ghost">
							<i class="fas fa-save"></i>
						</Button>

						<Button on:click={onCancelEdit} variant="ghost">
							<i class="fas fa-times"></i>
						</Button>
					{:else}
						<Button on:click={onEditPage} variant="ghost">
							<i class="fas fa-edit"></i>
						</Button>

						<Button on:click={onDeletePage} variant="ghost">
							<i class="fas fa-trash"></i>
						</Button>
					{/if}
					<!-- <button class="btn btn-primary">History</button> -->
				</div>
			{/if}
		</div>

		{#if editMode}
			<div class="flex items-center gap-5 mb-1">
				<Input bind:value={pageData.name} class="h-fit text-5xl -ml-3 my-0 border-0" style="padding-left: 9px"></Input>
			</div>
		{:else}
			<div class="text-5xl my-2" style="margin-left: -3px">
				{#if pageData}
					<div>{pageData.name}</div>
				{/if}
			</div>
		{/if}

		{#if editMode}
			<Textarea bind:value={content} class="flex-grow mb-5 -ml-3 border-0"></Textarea>
		{:else}
			<div class="markdown-body">
				{#if pageData}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div>{@html marked(pageData.body)}</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- <div class="flex flex-col px-6 sticky max-lg:hidden">
		<div class="text-base font-semibold">On this page</div>
		<div class="flex flex-col mt-3 ml-1">bookmark links?</div>
	</div> -->
</div>
