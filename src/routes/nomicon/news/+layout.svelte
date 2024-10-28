<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';
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
		refreshIndex();
	});

	const gotoPost = (slug) => {
		safeGoto(WEB_ROUTES.news + '/' + slug);
	};

	const onNewNewsPost = async () => {
		await createNewsPost();
		await refreshIndex();
		gotoPost('new-post');
	};

	const refreshIndex = async () => {
		newsIndex = await getNewsIndex();
		// we want unpublished posts to appear at the top, which is when published_at is null
		newsIndex.sort((a, b) => {
			if (a.published_at === null && b.published_at !== null) {
				return -1;
			} else if (a.published_at !== null && b.published_at === null) {
				return 1;
			} else {
				return b.published_at - a.published_at;
			}
		});
	};

	EventBus.on(Events.UPDATE_WIKI_INDEX, async () => {
		refreshIndex();
	});
</script>

<div class="flex h-full">
	<div class="flex flex-col items-start bg-background-900 pt-1 pb-3 max-w-56">
		<div class="flex flex-col items-start flex-grow overflow-hidden w-full">
			<div class="px-1 w-full">
				<Button
					on:click={() => gotoPost('')}
					variant="ghost"
					class="flex flex-col items-start text-md text-background-50 hover:text-primary-50 hover:bg-background-800 py-2 px-2 h-fit w-full"
				>
					News Home
				</Button>
			</div>
			<div class="px-3 w-full">
				<Separator class="my-2 w-full" />
			</div>

			<div class="flex flex-col px-1 overflow-y-auto overflow-x-hidden w-full">
				{#each newsIndex as post}
					<Button
						on:click={() => gotoPost(post.slug)}
						variant="ghost"
						class="flex flex-col items-start text-md text-background-50 hover:text-primary-50 hover:bg-background-800 py-1 px-2 h-fit w-full"
					>
						<div class="text-left truncate transition-none w-full">{post.title}</div>
						<div class="text-xs text-background-200">
							{moment(post.published_at).format('MMM D YYYY')}
						</div>
					</Button>
				{/each}
			</div>
		</div>

		{#if hasPermission('create_news_post')}
			<!-- <Separator /> -->
			<div class="px-3 w-full">
				<Button on:click={onNewNewsPost} class="w-full">+ New Post</Button>
			</div>
		{/if}
	</div>

	<slot />
</div>
