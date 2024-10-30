<script lang="ts">
	import 'github-markdown-css';

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { marked } from 'marked';
	import { EventBus, Events } from '$lib/eventbus.js';

	import Button from '$lib/components/ui/button/button.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';

	import { useWiki } from '@/models/useWiki';
	const { getWikiPage, saveWikiPage, deleteWikiPage } = useWiki();

	import { WEB_ROUTES } from '@/models/useConstants.js';
	import { useAuth } from '@/models/useAuth.js';
	import Input from '@/components/ui/input/input.svelte';
	const { safeGoto, hasPermission } = useAuth();

	let slug;
	let pageData;
	let editMode = false;
	let content = '';

	onMount(async () => {
		slug = $page.params.slug;
		pageData = await getWikiPage(slug);
		if (pageData === null) {
			safeGoto(WEB_ROUTES.wiki);
		}

		content = pageData.body;
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
	};

	const onEditPage = () => {
		editMode = true;
	};

	const onSavePage = async () => {
		const newPageData = {
			...pageData,
			body: content
		};

		const newSavedData = await saveWikiPage(newPageData);
		if (newSavedData !== null) {
			pageData = newSavedData;
			content = newSavedData.body;

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
	};
</script>

<div class="flex pl-8 w-full">
	<div class="flex flex-col w-full pt-4 pr-8 {editMode ? 'overflow-visible' : 'overflow-y-auto'}">
		<div class="flex items-center justify-between">
			<div class="text-base font-semibold text-background-200">
				{#if pageData}
					/{pageData.slug}
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
			<div class="flex items-center gap-5 mr-3 mb-1">
				<Input bind:value={pageData.name} class="h-fit text-5xl -ml-3"></Input>
				<div class="flex gap-1 items-center">
					<div>Slug:</div>
					<Input bind:value={pageData.slug} class="text-xl my-2 flex-grow-0 w-fit"></Input>
				</div>
			</div>
		{:else}
			<div class="text-5xl my-2">
				{#if pageData}
					<h1>{pageData.name}</h1>
				{/if}
			</div>
		{/if}

		{#if editMode}
			<Textarea bind:value={content} class="flex-grow mb-5 -ml-3"></Textarea>
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
