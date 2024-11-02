<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';

	import { Progress } from '$lib/components/ui/progress';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import { useBirdhouse } from '@/models/useBirdhouse';
	const { getCharacterPapMetrics, getCorporationTopContributorPapMetrics } = useBirdhouse();

	import { useNews } from '@/models/useNews';
	const { getNewsFeed } = useNews();

	import { useAuth } from '@/models/useAuth.js';
	// import PapEventLeaderboard from './PapEventLeaderboard.svelte';
	import PapWeeklyLeaderboard from './PapWeeklyLeaderboard.svelte';
	const { safeGoto } = useAuth();

	export let characterIds;

	let ready = false;
	let papMetrics = {};
	let corpTopContributors = [];
	let newsFeed = [];

	onMount(async () => {
		papMetrics = await getCharacterPapMetrics(characterIds);
		corpTopContributors = await getCorporationTopContributorPapMetrics(98718341);
		newsFeed = await getNewsFeed();
		ready = true;
	});

	const getTotalStrategicForMonth = () => {
		// we want the current month formatted as mm/yyyy
		let currentMonth = moment().format('MM/YYYY');
		if (!papMetrics.monthlyTotals[currentMonth]) return 0;
		return papMetrics.monthlyTotals[currentMonth].totalStrategic;
	};

	const getTotalPeacetimeForMonth = () => {
		// we want the current month formatted as mm/yyyy
		let currentMonth = moment().format('MM/YYYY');
		if (!papMetrics.monthlyTotals[currentMonth]) return 0;
		return papMetrics.monthlyTotals[currentMonth].totalPeacetime;
	};

	const gotoNewsPost = (post) => {
		safeGoto(`/nomicon/news/${post.slug}`);
	};

	const truncateString = (str, num) => {
		if (str.length > num) {
			return str.slice(0, num) + '...';
		} else {
			return str;
		}
	};
</script>

{#if ready}
	<div class="h-full overflow-y-auto">
		<div class="flex gap-3 px-3 py-2">
			<div class="flex flex-col gap-3 items-start justify-center">
				<div class="flex items-center bg-slate-800 lg:px-3 py-1 max-lg:px-3 shadow-sm shadow-black w-full">
					<div class="text-4xl mr-4 ml-1">{getTotalStrategicForMonth()}</div>
					<div class="lg:text-lg max-lg:text-lg text-left whitespace-nowrap">
						Strategic PAPs<br />this month
					</div>
				</div>
				<div class="flex items-center bg-orange-900 lg:px-3 py-1 max-lg:px-3 shadow-sm shadow-black w-full">
					<div class="text-4xl mr-4 ml-1">{getTotalPeacetimeForMonth()}</div>

					<div class="lg:text-lg max-lg:text-lg text-left whitespace-nowrap">
						Peacetime PAPs<br />this month
					</div>
				</div>
			</div>

			<div class="flex flex-col flex-grow shadow-sm shadow-black">
				<div class="flex items-center justify-center flex-grow text-xl bg-black px-3 py-1">
					{#if getTotalStrategicForMonth() < 8}
						You still have PAPs to get for this month.<br />Keep at it!
					{:else}
						You have met the PAP requirement for the month.<br />Nicely done.
					{/if}
				</div>

				<div class="flex flex-grow gap-4 items-center text-4xl px-4 py-1 bg-background-900">
					<span>0</span>
					<Progress value={getTotalStrategicForMonth()} max={8} />
					<span>8</span>
				</div>
			</div>
		</div>

		<div class="flex flex-wrap gap-3 px-3">
			<!-- <PapEventLeaderboard /> -->
			<PapWeeklyLeaderboard />

			<div class="flex flex-col flex-grow items-start gap-1 w-fit bg-background-900 shadow-sm shadow-black">
				<div class="flex items-center justify-between gap-2 text-xl bg-black px-3 py-1 w-full">
					Top {moment.utc().format('MMMM')} 8+ Champions

					<Tooltip.Root openDelay={0}>
						<Tooltip.Trigger><i class="fas fa-question-circle text-base" /></Tooltip.Trigger>
						<Tooltip.Content class="bg-background-800">
							<div class="text-sm">
								<span class="text-green-500">+number over required 8 </span>
								<span class="text-background-400">(total number)</span>
								PAPs
							</div>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>

				<div class="flex flex-col flex-grow gap-1 w-full">
					{#if corpTopContributors.length === 0}
						<div class="flex text-center items-center justify-center p-3 w-full">No one has gotten more than 8 PAPs yet this month.<br />Go be the first!</div>
					{:else}
						{#each corpTopContributors as contributor}
							<div class="flex items-center justify-between gap-3 px-3 even:bg-background-800 odd:bg-background-700 !bg-opacity-50">
								<div class="text-left text-base">{contributor.name}</div>
								<div class="text-right text-base">
									<span class="text-green-500">+{contributor.totalStrategic} </span>
									<span class="text-background-400">({contributor.totalStrategic + 8})</span>
									PAPs
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<div class="flex flex-col w-full px-3 mt-3 mb-3">
			<div class="flex items-center justify-between gap-2 text-xl bg-black px-3 py-1 w-full">News Feed</div>

			<div class="flex flex-col gap-3 w-full">
				{#each newsFeed as post}
					<button
						on:click={() => gotoNewsPost(post)}
						class="flex justify-between gap-12 hover:bg-background-800 bg-background-900 shadow-sm shadow-black p-3 w-full overflow-hidden"
					>
						<div class="flex flex-col items-start whitespace-nowrap">
							<div class="text-xl">{post.title}</div>
							<div class="text-sm text-background-300">
								Published {moment(post.published_at).fromNow()}
							</div>
						</div>
						<div class="flex justify-end">
							<div class="text-base text-right text-background-400">
								{truncateString(post.body, 160)}
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}
