<script lang="ts">
	import 'github-markdown-css';

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { marked } from 'marked';
	import moment from 'moment';
	import { EventBus, Events } from '$lib/eventbus.js';

	import Button from '$lib/components/ui/button/button.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import { type DateValue, CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import Input from '@/components/ui/input/input.svelte';
	import { useNews } from '@/models/useNews';
	const { getNewsPost, saveNewsPost, deleteNewsPost } = useNews();

	import { WEB_ROUTES } from '@/models/useConstants.js';
	import { useAuth } from '@/models/useAuth.js';
	const { safeGoto, hasPermission } = useAuth();

	let slug;
	let postData;
	let editMode = false;
	let content = '';
	let publishedAt: DateValue | undefined = undefined;
	let publishedAtTime;
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	onMount(async () => {
		slug = $page.params.slug;
		postData = await getNewsPost(slug);
		if (postData === null) {
			safeGoto(WEB_ROUTES.news);
		}

		content = postData.body;

		if (postData.published_at) {
			publishedAt = new CalendarDate(
				moment(postData.published_at).year(),
				moment(postData.published_at).month() + 1,
				moment(postData.published_at).date()
			);

			publishedAtTime = moment(postData.published_at).format('HH:mm');
		} else {
			publishedAt = undefined;
			publishedAtTime = undefined;
		}
	});

	$: {
		slug = $page.params.slug;
		loadPostData();
	}

	const loadPostData = async () => {
		postData = await getNewsPost(slug);

		if (postData === null) {
			safeGoto(WEB_ROUTES.news);
		}

		content = postData.body;
		if (postData.published_at) {
			publishedAt = new CalendarDate(
				moment(postData.published_at).year(),
				moment(postData.published_at).month() + 1,
				moment(postData.published_at).date()
			);

			publishedAtTime = moment(postData.published_at).format('HH:mm');
		} else {
			publishedAt = undefined;
			publishedAtTime = undefined;
		}
	};

	const onEditPost = () => {
		editMode = true;
	};

	const onSavePost = async () => {
		const newPostData = {
			...postData,
			body: content,
			primary_image_url: postData.primary_image_url || null
		};

		if (publishedAt !== undefined) {
			let dateString = `${publishedAt.day}/${publishedAt.month}/${publishedAt.year}`;
			let date = moment(dateString, 'DD/MM/YYYY');

			if (publishedAtTime) {
				date = date.set('hour', publishedAtTime.split(':')[0]);
				date = date.set('minute', publishedAtTime.split(':')[1]);
			} else {
				// no time set, so we default to 00:00
				date = date.set('hour', 0);
			}

			newPostData.published_at = date.toISOString();
		}

		const newSavedData = await saveNewsPost(newPostData);
		if (newSavedData !== null) {
			postData = newSavedData;
			content = newSavedData.body;
			if (postData.published_at) {
				publishedAt = new CalendarDate(
					moment(postData.published_at).year(),
					moment(postData.published_at).month() + 1,
					moment(postData.published_at).date()
				);

				publishedAtTime = moment(postData.published_at).format('HH:mm');
			} else {
				publishedAt = undefined;
				publishedAtTime = undefined;
			}

			toast.success('Post saved');

			editMode = false;
			EventBus.emit(Events.UPDATE_WIKI_INDEX);

			// and we want to update the URL
			safeGoto(WEB_ROUTES.news + '/' + postData.slug);
		}
	};

	const onDeletePost = async () => {
		const deleted = await deleteNewsPost(postData.id);
		if (deleted) {
			toast.success('Post deleted');
			EventBus.emit(Events.UPDATE_WIKI_INDEX);
			// send them back to the news home
			safeGoto(WEB_ROUTES.news);
		}
	};

	const onCancelEdit = () => {
		editMode = false;

		content = postData.body;
	};

	const onUnPublish = async () => {
		const newPostData = {
			...postData,
			published_at: null
		};

		const newSavedData = await saveNewsPost(newPostData);
		if (newSavedData !== null) {
			postData = newSavedData;
			content = newSavedData.body;
			publishedAt = undefined;
			publishedAtTime = undefined;

			toast.success('Post unpublished');

			editMode = false;
			EventBus.emit(Events.UPDATE_WIKI_INDEX);
		}
	};
</script>

<div class="flex px-8 w-full h-full">
	<div class="flex flex-col w-full pt-4 {editMode ? 'overflow-visible' : 'overflow-y-auto'}">
		<div class="flex items-center justify-between">
			<div class="flex gap-3">
				{#if editMode}
					<div class="flex gap-2 items-center">
						<div>Slug:</div>
						<Input bind:value={postData.slug} class="input-underlined text-base my-2 flex-grow-0 w-fit"></Input>
					</div>

					<div class="flex gap-2 items-center">
						<div>Image URL:</div>
						<Input
							bind:value={postData.primary_image_url}
							class="input-underlined text-base my-2 flex-grow-0 w-fit"
							placeholder="Using corp logo"
						></Input>
					</div>

					<div class="flex gap-2 items-center">
						<div>Published at:</div>
						<Popover.Root openFocus>
							<Popover.Trigger asChild let:builder>
								<Button
									variant="ghost"
									class={cn(
										'w-[280px] justify-start text-left font-normal border-background-50 hover:bg-background-700 hover:text-background-50 bg-background-900 border-b rounded-none',
										!publishedAt && 'text-muted-foreground'
									)}
									builders={[builder]}
								>
									{publishedAt ? df.format(publishedAt.toDate(getLocalTimeZone())) : 'Select a date'}
								</Button>
							</Popover.Trigger>
							<Popover.Content class="bg-background-800 text-background-50 w-auto p-0" align="start">
								<Calendar bind:value={publishedAt} initialFocus />
							</Popover.Content>
						</Popover.Root>

						<Input type="time" bind:value={publishedAtTime} class="input-underlined text-base my-2 flex-grow-0 w-fit"></Input>

						<Button on:click={onUnPublish} class="">Unpublish</Button>
					</div>
				{/if}
			</div>

			{#if hasPermission('update_news_post') || hasPermission('delete_news_post')}
				<div class="flex gap-2">
					{#if editMode}
						<Button on:click={onSavePost} variant="ghost">
							<i class="fas fa-save"></i>
						</Button>

						<Button on:click={onCancelEdit} variant="ghost">
							<i class="fas fa-times"></i>
						</Button>
					{/if}
					<!-- <button class="btn btn-primary">History</button> -->
				</div>
			{/if}
		</div>

		{#if editMode}
			<div class="flex items-center gap-5 mb-2">
				<Input bind:value={postData.title} class="h-fit text-5xl"></Input>
			</div>
		{:else}
			<div class="flex items-center">
				<Button on:click={() => safeGoto(WEB_ROUTES.news)} variant="ghost" class="-ml-3 hover:bg-transparent hover:text-primary-50">
					<i class="fas fa-arrow-left mr-3 transition-none"></i> Back
				</Button>

				<div class="flex-grow"></div>

				{#if hasPermission('update_news_post') || hasPermission('delete_news_post')}
					<Button on:click={onEditPost} variant="ghost">
						<i class="fas fa-edit"></i>
					</Button>

					<Button on:click={onDeletePost} variant="ghost">
						<i class="fas fa-trash"></i>
					</Button>
				{/if}
			</div>

			<div class="flex items-center gap-2 mb-8">
				<div class="flex items-end relative text-5xl my-2">
					{#if postData}
						<div>{postData.title}</div>

						{#if postData.published_at}
							<div class="absolute -bottom-7 text-sm text-background-300 whitespace-nowrap">
								Published on {moment(postData.published_at).format('MMMM Do YYYY, h:mm a')}
							</div>
						{:else}
							<div class="absolute -bottom-7 text-sm text-background-200 bg-primary-800 px-2 rounded-sm">Not published yet</div>
						{/if}
					{/if}
				</div>
			</div>
		{/if}

		{#if editMode}
			<Textarea bind:value={content} class="flex-grow mb-5"></Textarea>
		{:else}
			<div class="markdown-body">
				{#if postData}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div>{@html marked(postData.body)}</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
