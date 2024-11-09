<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	import Button from '$lib/components/ui/button/button.svelte';

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

	const truncateString = (str, num) => {
		if (str.length > num) {
			return str.slice(0, num) + '...';
		} else {
			return str;
		}
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
				class="grid grid-cols-[120px,1fr,50px] items-center gap-3 bg-background-900 hover:bg-background-800 hover:cursor-pointer pr-5 rounded-sm w-full"
				on:click={() => gotoPost(post.slug)}
				style="max-height: 120px; min-height: 120px;"
			>
				<div class="flex items-center justify-center w-full">
					{#if post.primary_image_url}
						<img src={post.primary_image_url} alt="news post" class="rounded-sm object-cover w-full" style="max-height: 120px;" />
					{:else}
						<img src={`${base}/images/Illuminated-Logo.svg`} alt="news post" class="rounded-sm object-cover" style="max-height: 110px;" />
					{/if}
				</div>

				<div class="flex flex-col justify-start items-start w-full h-full py-3">
					<div class="text-3xl whitespace-nowrap">{post.title}</div>

					<div class="flex gap-5 mt-1">
						{#if post.published_at === null}
							<div class="text-base text-left text-primary-50 min-w-36 whitespace-nowrap">Draft, not published</div>
						{:else}
							<div class="text-base text-left text-background-50 min-w-36 whitespace-nowrap">
								{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Unpublished'}
							</div>
						{/if}

						<div class="flex items-start">
							<div class="text-base text-left text-background-400">
								{truncateString(post.body, 300)}
							</div>
						</div>
					</div>
				</div>

				<!-- <div class="flex flex-col flex-grow items-start justify-start h-full py-5">
					<div class="text-3xl whitespace-nowrap">{post.title}</div>
					{#if post.published_at === null}
						<div class="text-base text-primary-50">Draft, not published</div>
					{:else}
						<div class="text-base text-background-50">
							{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Unpublished'}
						</div>
					{/if}
				</div>

				<div class="flex items-start justify-end px-6 py-5 h-full">
					<div class="text-base text-left text-background-400">
						{truncateString(post.body, 400)}
					</div>
				</div> -->

				<div class="py-5">
					<i class="fas fa-chevron-right"></i>
				</div>
			</button>
		{/each}
	</div>
</div>
