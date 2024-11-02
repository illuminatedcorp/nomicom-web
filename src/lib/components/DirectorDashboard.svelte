<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';

	import PapsBarChart from './PapsBarChart.svelte';
	import Separator from './ui/separator/separator.svelte';
	import Button from './ui/button/button.svelte';

	import { useBirdhouse } from '@/models/useBirdhouse';
	const { getCorporationPapMetrics } = useBirdhouse();

	import { useUsers } from '@/models/useUsers';
	const { getAllUsers } = useUsers();

	import { useCharacters } from '@/models/useCharacters';
	const { getMainCharacter } = useCharacters();

	// let iframe;
	const currentMonth = moment.utc().month();
	let thisMonthStartDate = moment.utc().month(currentMonth).date(1).startOf('day').toISOString();
	let thisMonthEndDate = moment
		.utc()
		.month(currentMonth + 1)
		.date(1)
		.startOf('day')
		.toISOString();

	let lastMonthStartDate = moment
		.utc()
		.month(currentMonth - 1)
		.date(1)
		.startOf('day')
		.toISOString();
	let lastMonthEndDate = moment.utc().month(currentMonth).date(1).startOf('day').toISOString();

	let thisMonthPapsBarChart;
	let lastMonthPapsBarChart;
	let allUsers = [];

	let thisMonthMetrics = [];
	let lastMonthMetrics = [];

	onMount(async () => {
		allUsers = await getAllUsers();

		await update();
	});

	const showCorpStats = () => {
		console.log('show corp stats');
	};

	const showUserStats = (user) => {
		console.log('show user stats', user);
	};

	export const update = async () => {
		thisMonthMetrics = await getCorporationPapMetrics(98718341, thisMonthStartDate, thisMonthEndDate, -1, true);
		thisMonthMetrics.sort((a, b) => a.totalStrategic - b.totalStrategic);

		thisMonthPapsBarChart.update();

		lastMonthMetrics = await getCorporationPapMetrics(98718341, lastMonthStartDate, lastMonthEndDate, -1, true);
		lastMonthMetrics.sort((a, b) => a.totalStrategic - b.totalStrategic);

		lastMonthPapsBarChart.update();
	};
</script>

<div class="flex w-full h-full overflow-hidden">
	<div class="flex flex-col bg-background-800 w-48 h-full overflow-hidden">
		<Button variant="link" on:click={showCorpStats} class="flex justify-start text-background-50 w-full px-2">Overview</Button>

		<Separator />

		<div class="flex flex-col flex-grow h-0 overflow-y-auto">
			{#each allUsers as user}
				<Button variant="link" on:click={() => showUserStats(user)} class="flex justify-start text-background-50 w-full px-2 py-1">
					{getMainCharacter(user).name}
				</Button>
			{/each}
		</div>
	</div>

	<!-- <div class="testing">
		<iframe
			bind:this={iframe}
			title="PAP Metrics"
			src="https://finance.birdhouse.ink/public/dashboard/e3ba0b98-b0bc-42d1-9095-f31a389958eb#theme=night&bordered=false&titled=false"
			allowtransparency
			class="testing-iframe"
		></iframe>
	</div> -->

	<div class="flex flex-col h-full w-full overflow-y-auto">
		<div class="flex flex-col background-gradient px-3 h-fit">
			<div class="text-xl">This month's PAPs</div>
			<PapsBarChart bind:this={thisMonthPapsBarChart} metrics={thisMonthMetrics} startDate={thisMonthStartDate} endDate={thisMonthEndDate} />
		</div>

		<div class="flex flex-col background-gradient px-3 h-fit">
			<div class="text-xl">Last month's PAPs</div>
			<PapsBarChart bind:this={lastMonthPapsBarChart} metrics={lastMonthMetrics} startDate={lastMonthStartDate} endDate={lastMonthEndDate} />
		</div>
	</div>
</div>

<!-- <style>
	.testing {
		position: relative;
		overflow: hidden;
		width: calc(100% - 20px);
		max-width: 1045px;
		height: 544px;
		border-radius: 8px;
	}

	.testing-iframe {
		position: absolute;
		top: -66px;
		left: -35px;
		width: calc(100% + 70px);
		height: 800px;
	}
</style> -->
