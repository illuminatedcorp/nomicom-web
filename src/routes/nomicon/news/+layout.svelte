<script lang="ts">
	import { onMount } from 'svelte';
	import { EventBus, Events } from '$lib/eventbus.js';

	import Button from '$lib/components/ui/button/button.svelte';

	import { useNews } from '@/models/useNews';
	const { getNewsIndex, createNewsPost } = useNews();

	import { WEB_ROUTES } from '@/models/useConstants.js';
	import { useAuth } from '@/models/useAuth.js';
	import Separator from '@/components/ui/separator/separator.svelte';
	const { safeGoto, hasPermission } = useAuth();

	let newsIndex = [];

	onMount(async () => {
		newsIndex = await getNewsIndex();
	});

	const gotoPost = (slug) => {
		safeGoto(WEB_ROUTES.news + '/' + slug);
	};

	const onNewNewsPost = async () => {
		await createNewsPost();
		newsIndex = await getNewsIndex();
		gotoPost('new-post');
	};

	EventBus.on(Events.UPDATE_WIKI_INDEX, async () => {
		newsIndex = await getNewsIndex();
	});
</script>

<div class="flex h-full">
	<div class="flex flex-col items-start bg-background-900 pt-1 pb-3 px-3 max-w-48">
		<div class="flex flex-col items-start flex-grow overflow-y-auto">
			<Button
				on:click={() => gotoPost('')}
				variant="link"
				class="text-md text-background-50 hover:text-primary-50 p-0">News Home</Button
			>

			<Separator class="my-2" />

			{#each newsIndex as post}
				<Button
					on:click={() => gotoPost(post.slug)}
					variant="link"
					class="flex justify-start text-md text-background-50 hover:text-primary-50 p-0 w-full"
				>
					<span class="truncate transition-none">{post.title}</span>
				</Button>
			{/each}
		</div>

		{#if hasPermission('create_news_post')}
			<!-- <Separator /> -->
			<Button on:click={onNewNewsPost} class="w-full">+ New Post</Button>
		{/if}
	</div>

	<slot />
</div>
