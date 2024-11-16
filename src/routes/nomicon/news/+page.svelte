<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	import Button from '$lib/components/ui/button/button.svelte';

	import { stripMarkdown } from '@/components/utilities';

	import { WEB_ROUTES } from '$lib/models/useConstants';
	import { useAuth } from '$lib/models/useAuth';
	const { safeGoto, hasPermission } = useAuth();

	import { useNews } from '@/models/useNews';
	const { getNewsIndex, createNewsPost } = useNews();

	let newsIndex = [];

	onMount(() => {
		const targetSlug = localStorage.getItem('newsSlug');
		if (targetSlug) {
			localStorage.removeItem('newsSlug');
			gotoPost(targetSlug);
		} else {
			refreshIndex();
		}
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
</script>

<div class="flex flex-col pl-8 pt-6 w-full h-full overflow-hidden">
	<div class="flex pr-8">
		<div class="text-3xl">Corporation News</div>
		<div class="flex-grow"></div>

		{#if hasPermission('create_news_post')}
			<Button on:click={onNewNewsPost} class="flex items-center gap-2">
				<i class="fas fa-plus"></i>
				<span>New Post</span>
			</Button>
		{/if}
	</div>

	<div class="flex flex-col gap-6 mt-6 w-full h-fit overflow-y-auto pb-3 pr-8">
		{#each newsIndex as post}
			<button
				class="grid grid-cols-[120px,1fr,50px] max-lg:grid-cols-[100px,1fr,50px] items-center gap-3 bg-background-900 hover:bg-background-800 hover:cursor-pointer pr-5 rounded-sm w-full"
				on:click={() => gotoPost(post.slug)}
				style="max-height: 120px; min-height: 120px;"
			>
				<div class="flex items-center justify-center w-full">
					{#if post.primary_image_url}
						<img src={post.primary_image_url} alt="news post" class="rounded-sm object-cover w-full max-h-[120px]" />
					{:else}
						<img
							src={`${base}/images/Illuminated-Logo.svg`}
							alt="news post"
							class="rounded-sm object-cover max-h-[110px] max-lg:max-h-[100px]"
						/>
					{/if}
				</div>

				<div class="flex flex-col flex-grow justify-start items-start h-full py-3">
					<div class="truncate text-3xl max-lg:text-xl whitespace-nowrap max-sm:max-w-[220px]">{post.title}</div>

					<div class="flex max-lg:flex-col lg:gap-5 lg:mt-1">
						{#if post.published_at === null}
							<div class="text-base max-lg:text-sm text-left text-primary-50 min-w-36 whitespace-nowrap">Draft, not published</div>
						{:else}
							<div class="text-base max-lg:text-sm text-left text-background-200 min-w-36 whitespace-nowrap">
								{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Unpublished'}
							</div>
						{/if}

						<div class="flex items-start">
							<div class="truncate-2 text-base text-left text-background-400">
								{stripMarkdown(post.body)}
							</div>
						</div>
					</div>
				</div>

				<div class="py-5">
					<i class="fas fa-chevron-right"></i>
				</div>
			</button>
		{/each}
	</div>
</div>
