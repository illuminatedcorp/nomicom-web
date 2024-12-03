<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';

	import PapsBarChart from './PapsBarChart.svelte';
	import Separator from './ui/separator/separator.svelte';
	import Button from './ui/button/button.svelte';
	import CorpPapBoard from './CorpPapBoard.svelte';

	import { usePapService } from '@/models/usePapService';
	const { getCorporationPaps } = usePapService();

	import { useUsers } from '@/models/useUsers';
	const { getAllUsers } = useUsers();

	import { useCharacters } from '@/models/useCharacters';
	const { getMainCharacter } = useCharacters();

	// let iframe;
	let currentMonthNumber = moment.utc().month();
	// let thisMonthStartDate = moment.utc().month(currentMonth).date(1).startOf('day').toISOString();
	// let thisMonthEndDate = moment
	// 	.utc()
	// 	.month(currentMonth + 1)
	// 	.date(1)
	// 	.startOf('day')
	// 	.toISOString();

	// let lastMonthStartDate = moment
	// 	.utc()
	// 	.month(currentMonth - 1)
	// 	.date(1)
	// 	.startOf('day')
	// 	.toISOString();
	// let lastMonthEndDate = moment.utc().month(currentMonth).date(1).startOf('day').toISOString();

	let thisMonthPapsBarChart;
	// let lastMonthPapsBarChart;
	let allUsers = [];

	let monthMetrics = [];
	// let lastMonthMetrics = [];

	let currentStartDate = moment.utc().month(currentMonthNumber).date(1).startOf('day').toISOString();
	let currentEndDate = moment
		.utc()
		.month(currentMonthNumber + 1)
		.date(1)
		.startOf('day')
		.toISOString();

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

	const selectMonth = (month) => {
		currentMonthNumber = month;
		currentStartDate = moment.utc().month(month).date(1).startOf('day').toISOString();
		currentEndDate = moment
			.utc()
			.month(month + 1)
			.date(1)
			.startOf('day')
			.toISOString();
	};

	const copyPapNumbers = () => {
		// we want to assemble the data so we copy two columns, the name and the total strategic
		console.log(monthMetrics);
		const data = monthMetrics.map((m) => `${m.name}\t${m.totalStrategic}`).join('\n');
		navigator.clipboard.writeText(data);
	};

	export const update = async () => {
		monthMetrics = await getCorporationPaps(98718341, currentStartDate, currentEndDate, null, true);
		if (monthMetrics) {
			monthMetrics.sort((a, b) => a.totalStrategic - b.totalStrategic);

			thisMonthPapsBarChart.update();
		}

		// lastMonthMetrics = await getCorporationPaps(98718341, lastMonthStartDate, lastMonthEndDate, null, true);
		// if (lastMonthMetrics) {
		// 	lastMonthMetrics.sort((a, b) => a.totalStrategic - b.totalStrategic);

		// 	lastMonthPapsBarChart.update();
		// }
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

	<div class="flex flex-col h-full w-full overflow-y-auto">
		<div class="flex flex-col background-gradient px-3 h-fit">
			<div class="flex gap-3 border-b border-background-500">
				{#each Array.from({ length: moment.utc().diff(moment.utc('2024-06-01'), 'months') + 1 }, (_, i) => i) as i}
					<Button variant="link" on:click={() => selectMonth(i + 5)} class="flex justify-start text-background-50 w-full px-2">
						{moment
							.utc()
							.month(i + 5)
							.format('MMMM')}
					</Button>
				{/each}
			</div>

			<div class="flex py-2">
				<div>Corp Average PAPs: TODO</div>

				<div class="flex-grow"></div>

				<Button on:click={copyPapNumbers} class="flex justify-end text-background-50 px-2">Copy PAP Numbers</Button>
			</div>

			<div class="flex gap-3">
				<PapsBarChart bind:this={thisMonthPapsBarChart} metrics={monthMetrics} startDate={currentStartDate} endDate={currentEndDate} />

				<CorpPapBoard class="max-h-full h-full" month={currentMonthNumber} />
			</div>
		</div>

		<!-- <div class="flex flex-col background-gradient px-3 h-fit">
			<div class="text-xl">Last month's PAPs</div>
			<PapsBarChart
				bind:this={lastMonthPapsBarChart}
				metrics={lastMonthMetrics}
				startDate={lastMonthStartDate}
				endDate={lastMonthEndDate}
			/>
		</div> -->
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
