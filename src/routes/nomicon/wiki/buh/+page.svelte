<script lang="ts">
	import 'github-markdown-css';

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { marked } from 'marked';

	import Button from '$lib/components/ui/button/button.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';

	import { useBirdhouse } from '@/models/useBirdhouse.js';
	const { getWikiPage, saveWikiPage } = useBirdhouse();

	let slug;
	let pageData;
	let editMode = false;
	let content = '';

	onMount(async () => {
		slug = $page.params.slug;
		pageData = await getWikiPage(slug);
		content = pageData.content;

		console.log(slug);
		console.log(pageData);
	});

	const onEditPage = () => {
		editMode = true;
	};

	const onSavePage = async () => {
		console.log('save page', content);
		const newPageData = {
			...pageData,
			content
		};

		const newSavedData = await saveWikiPage(newPageData);
		console.log(newSavedData);
		if (newSavedData !== null) {
			pageData = newSavedData;
			content = newSavedData.content;

			toast.success('Page saved');

			editMode = false;
		}
	};
</script>

<div class="flex pl-8 max-lg:pr-8 w-full">
	<div
		class="flex flex-col max-lg:w-full lg:w-3/4 pt-8 {editMode
			? 'overflow-visible'
			: 'overflow-y-auto'}"
	>
		<div class="flex items-center justify-between">
			<div>Breadcrumb thing here?</div>

			<div class="flex gap-2">
				{#if editMode}
					<Button on:click={onSavePage} variant="ghost">
						<i class="fas fa-save"></i>
					</Button>
				{:else}
					<Button on:click={onEditPage} variant="ghost">
						<i class="fas fa-edit"></i>
					</Button>
				{/if}
				<!-- <button class="btn btn-primary">History</button> -->
			</div>
		</div>

		<div class="text-3xl my-2">
			{#if pageData}
				<h1>{pageData.title}</h1>
			{/if}
		</div>

		{#if editMode}
			<Textarea bind:value={content} class="flex-grow mb-5 -ml-3"></Textarea>
		{:else}
			<div class="markdown-body">
				{#if pageData}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div>{@html marked(pageData.content)}</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="flex flex-col px-6 sticky max-lg:hidden">
		<div class="text-base font-semibold">On this page</div>
		<div class="flex flex-col mt-3 ml-1">bookmark links?</div>
	</div>
</div>
