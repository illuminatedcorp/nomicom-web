<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';

	import { Progress } from '$lib/components/ui/progress';

	import { useBirdhouse } from '@/models/useBirdhouse';
	const { getCharacterPapMetrics, getCorporationTopPapMetrics } = useBirdhouse();

	export let characterId;

	let ready = false;
	let papMetrics = {};
	let corpTopContributors = [];

	onMount(async () => {
		papMetrics = await getCharacterPapMetrics(characterId);
		corpTopContributors = await getCorporationTopPapMetrics(98718341);
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
</script>

{#if ready}
	{@const week = Math.floor(moment.utc().date() / 7)}
	<div class="flex flex-col items-center">
		<div class="flex flex-wrap gap-3 items-center justify-center py-2">
			<div class="flex items-center bg-slate-800 lg:px-3 lg:py-2 max-lg:px-3 max-lg:py-2">
				<div class="text-4xl mr-4 ml-1">{getTotalStrategicForMonth()}</div>
				<div class="lg:text-xl max-lg:text-lg text-left">Strategic PAPs<br />this month</div>
			</div>
			<div class="flex items-center bg-orange-900 lg:px-3 lg:py-2 max-lg:px-3 max-lg:py-2">
				<div class="text-4xl mr-4 ml-1">{getTotalPeacetimeForMonth()}</div>

				<div class="lg:text-xl max-lg:text-lg text-left">Peacetime PAPs<br />this month</div>
			</div>
		</div>

		<div class="flex flex-col mt-3">
			<div>
				{#if getTotalStrategicForMonth() < 8}
					<div class="flex flex-col items-center gap-2">
						<div class="text-xl bg-black px-3 py-1">
							You still have PAPs to get for this month.<br />Keep at it!
						</div>
					</div>
				{:else}
					<div class="flex flex-col items-center gap-2">
						<div class="text-xl bg-black px-3 py-1">
							You have met the PAP requirement for the month.<br />Nicely done.
						</div>
					</div>
				{/if}

				<div class="flex gap-2 items-center text-2xl px-10">
					<span>0</span>
					<Progress value={getTotalStrategicForMonth()} max={8} />
					<span>8</span>
				</div>
			</div>
		</div>

		<div class="flex flex-col items-start gap-2 mt-3 w-fit mt-3">
			<div class="flex text-xl bg-black px-3 py-1">
				Tournament Leaderboard (Week #{week}, {moment
					.utc()
					.month(moment.utc().month())
					.date((week - 1) * 7 + 1)
					.startOf('day')
					.format('Do')} - {moment
					.utc()
					.month(moment.utc().month())
					.date((week - 1) * 7 + 7)
					.endOf('day')
					.format('Do')})
			</div>

			<div class="flex flex-col flex-grow gap-1 w-full">
				{#each corpTopContributors as contributor}
					<div
						class="grid grid-cols-2 items-center gap-3 px-3 even:bg-background-800 odd:bg-background-900"
					>
						<div class="text-left text-lg">{contributor.name}</div>
						<div class="text-right text-lg">{contributor.totalStrategic} PAPs</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
